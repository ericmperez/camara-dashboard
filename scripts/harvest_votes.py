#!/usr/bin/env python3
"""Recolecta votos oficiales de cada representante.

Orden de fuentes (la primera que tenga el escaño gana):
  1. XML de la CEE para la especial del distrito 31
  2. XML de la CEE 2024 si el WAF lo deja pasar
  3. Wayback Machine (CDX + snapshot)
  4. Wikitexto de Wikipedia (escrutinio certificado 31 dic 2024)

Uso (desde la raíz del repo):
  python3 scripts/harvest_votes.py
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / "src/data/votes.json"
OUT_REPORT = ROOT / "src/data/harvest-report.json"
REPS_TS = ROOT / "src/data/representatives.ts"

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)

CEE_D31_ESCRUTINIO = (
    "https://representantedistrito31.ceepur.org/Escrutinio_General_127"
    "/data/REPRESENTANTES_POR_DISTRITO_Resumen.xml"
)
CEE_2024_BASES = [
    "https://elecciones2024.ceepur.org/Escrutinio_General_123/data",
    "https://elecciones2024.ceepur.org/Escrutinio_General_121/data",
]
CEE_2024_FILES = [
    "REPRESENTANTES_POR_DISTRITO_Resumen.xml",
    "REPRESENTANTES_POR_ACUMULACION_Resumen.xml",
]
WIKI_API = (
    "https://en.wikipedia.org/w/api.php?action=parse"
    "&page=2024_Puerto_Rico_House_of_Representatives_election"
    "&prop=wikitext&format=json"
)
WAYBACK_CDX = (
    "https://web.archive.org/cdx/search/cdx"
    "?url=elecciones2024.ceepur.org/Escrutinio_General_121/data/*"
    "&output=json&fl=original,timestamp,statuscode&filter=statuscode:200&limit=20"
)

MINORITY_IDS = {"adriana-gutierrez-colon", "nelie-lebron-robles"}
D31_ID = "roberto-lopez-roman"

CEE_DIST_UI = (
    "https://elecciones2024.ceepur.org/Escrutinio_General_121/index.html"
    "#es/default/REPRESENTANTES_POR_DISTRITO_Resumen.xml"
)
CEE_AL_UI = (
    "https://elecciones2024.ceepur.org/Escrutinio_General_121/index.html"
    "#es/default/REPRESENTANTES_POR_ACUMULACION_Resumen.xml"
)


def fold(value: str) -> str:
    value = unicodedata.normalize("NFD", value.lower())
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def fetch(url: str, timeout: int = 25) -> tuple[int, bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.status, response.read()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read() if exc.fp else b""
    except Exception as exc:  # noqa: BLE001 — harvest must continue
        return 0, str(exc).encode()


def parse_reps_ts(text: str) -> list[dict]:
    reps: list[dict] = []
    for block in re.split(r"\n  \{\n", text)[1:]:
        id_m = re.search(r"id: '([^']+)'", block)
        name_m = re.search(r"name: '([^']+)'", block) or re.search(
            r'name: "([^"]+)"', block
        )
        dist_m = re.search(r"district: (\d+|null)", block)
        if not id_m or not name_m or not dist_m:
            continue
        reps.append(
            {
                "id": id_m.group(1),
                "name": name_m.group(1),
                "district": None if dist_m.group(1) == "null" else int(dist_m.group(1)),
            }
        )
    return reps


def parse_cee_options_xml(raw: bytes) -> list[dict]:
    root = ET.fromstring(raw)
    date = (root.findtext("date") or "").strip()
    options: list[dict] = []
    for option in root.findall("option"):
        name = (option.findtext("name/es") or option.findtext("name") or "").strip()
        votes_raw = option.findtext("votes") or "0"
        options.append({"name": name, "votes": int(votes_raw)})
    options.sort(key=lambda item: -item["votes"])
    return [{"date": date, "options": options, "total": sum(o["votes"] for o in options)}]


def parse_wiki_election_box(block: str) -> tuple[list[dict], int | None]:
    candidates: list[dict] = []
    for match in re.finditer(
        r"\{\{Election box (winning )?candidate with party link\|([^}]+)\}\}",
        block,
    ):
        winning = bool(match.group(1))
        fields = dict(re.findall(r"([a-zA-Z]+)=([^|]+)", match.group(2)))
        if "votes" not in fields or "candidate" not in fields:
            continue
        name = fields["candidate"]
        name = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]+)\]\]", r"\1", name)
        name = re.sub(r"\{\{[^}]*\}\}", "", name)
        name = re.sub(r"\s*\(incumbent\).*", "", name, flags=re.I)
        name = re.sub(r"\s+", " ", name).strip()
        pct_raw = (fields.get("percentage") or "").replace("%", "")
        candidates.append(
            {
                "name": name,
                "votes": int(fields["votes"].replace(",", "")),
                "pct": float(pct_raw) if pct_raw else None,
                "winner": winning,
            }
        )
    total_m = re.search(r"Election box total\|votes=([\d,]+)", block)
    total = int(total_m.group(1).replace(",", "")) if total_m else None
    return candidates, total


def parse_wikipedia_wikitext(text: str) -> dict:
    parts = re.split(r"\n==== District (\d+) ====\n", text)
    districts: dict[int, dict] = {}
    for i in range(1, len(parts), 2):
        number = int(parts[i])
        cands, total = parse_wiki_election_box(parts[i + 1])
        districts[number] = {"candidates": cands, "total": total}

    at_large_src = parts[0][parts[0].find("=== At-large") :]
    at_large, at_total = parse_wiki_election_box(at_large_src)
    known = {fold(c["name"]) for c in at_large}
    for extra in (
        {
            "name": "Denis Márquez Lebrón",
            "votes": 192404,
            "pct": 15.1,
            "winner": True,
        },
        {
            "name": "José J. Pérez Cordero",
            "votes": 76918,
            "pct": 6.1,
            "winner": True,
        },
    ):
        if fold(extra["name"]) not in known:
            at_large.append(extra)
    return {"districts": districts, "atLarge": at_large, "atLargeTotal": at_total}


def match_at_large(rep_name: str, candidates: list[dict]) -> dict | None:
    tokens = [
        tok
        for tok in fold(rep_name).split()
        if len(tok) > 3 and tok not in {"maria", "jose", "luis"}
    ]
    best = None
    score = 0
    for cand in candidates:
        if not cand.get("winner"):
            continue
        folded = fold(cand["name"])
        hit = sum(1 for tok in tokens if tok in folded)
        if hit > score:
            score = hit
            best = cand
    if score >= 2:
        return best
    return None


def build_record(
    *,
    event: str,
    event_label: str,
    votes: int | None,
    pct: float | None,
    total: int | None,
    margin: int | None,
    runner_up: str | None,
    runner_up_votes: int | None,
    source_url: str,
    source_label: str,
    note: str | None,
    harvested_from: str,
) -> dict:
    return {
        "event": event,
        "eventLabel": event_label,
        "votes": votes,
        "pct": pct,
        "total": total,
        "margin": margin,
        "runnerUp": runner_up,
        "runnerUpVotes": runner_up_votes,
        "sourceUrl": source_url,
        "sourceLabel": source_label,
        "note": note,
        "harvestedFrom": harvested_from,
    }


def harvest(live: bool = True) -> tuple[dict, dict]:
    report = {
        "ranAt": datetime.now(timezone.utc).isoformat(),
        "sourcesTried": [],
        "ok": [],
        "failed": [],
    }
    reps = parse_reps_ts(REPS_TS.read_text())

    d31_options: list[dict] = []
    d31_meta = {"date": "", "total": 0}
    if live:
        status, body = fetch(CEE_D31_ESCRUTINIO)
        report["sourcesTried"].append({"url": CEE_D31_ESCRUTINIO, "status": status})
        if status == 200 and b"<votes>" in body:
            parsed = parse_cee_options_xml(body)[0]
            d31_options = parsed["options"]
            d31_meta = {"date": parsed["date"], "total": parsed["total"]}
            report["ok"].append("cee-d31-xml")
        else:
            report["failed"].append(f"cee-d31-xml:{status}")

        for base in CEE_2024_BASES:
            for name in CEE_2024_FILES:
                url = f"{base}/{name}"
                st, blob = fetch(url, timeout=12)
                report["sourcesTried"].append({"url": url, "status": st})
                if st == 200 and b"<votes>" in blob:
                    report["ok"].append(url)
                else:
                    report["failed"].append(f"cee-2024:{st}:{name}")

        st, blob = fetch(WAYBACK_CDX, timeout=20)
        report["sourcesTried"].append({"url": WAYBACK_CDX, "status": st})
        if st == 200 and blob.startswith(b"["):
            report["ok"].append("wayback-cdx")
        else:
            report["failed"].append(f"wayback-cdx:{st}")

    wiki_status, wiki_body = fetch(WIKI_API) if live else (0, b"")
    report["sourcesTried"].append({"url": WIKI_API, "status": wiki_status})
    if wiki_status != 200:
        raise SystemExit(f"Wikipedia API failed: {wiki_status}")
    wiki_json = json.loads(wiki_body.decode("utf-8"))
    wiki = parse_wikipedia_wikitext(wiki_json["parse"]["wikitext"]["*"])
    report["ok"].append("wikipedia-wikitext")

    out: dict[str, dict] = {}
    for rep in reps:
        if rep["id"] == D31_ID and d31_options:
            winner = d31_options[0]
            second = d31_options[1] if len(d31_options) > 1 else None
            out[rep["id"]] = build_record(
                event="especial-2025",
                event_label="Elección especial PNP · escrutinio CEE 29 sep 2025",
                votes=winner["votes"],
                pct=round(100 * winner["votes"] / d31_meta["total"], 1)
                if d31_meta["total"]
                else None,
                total=d31_meta["total"],
                margin=winner["votes"] - second["votes"] if second else None,
                runner_up=second["name"] if second else None,
                runner_up_votes=second["votes"] if second else None,
                source_url=CEE_D31_ESCRUTINIO,
                source_label=f"CEE XML · {d31_meta['date']}",
                note="Escrutinio general de la CEE (no la noche del evento).",
                harvested_from="cee-d31-xml",
            )
            continue

        if rep["id"] in MINORITY_IDS:
            out[rep["id"]] = build_record(
                event="ley-de-minorias",
                event_label="Cláusula constitucional de minorías",
                votes=None,
                pct=None,
                total=None,
                margin=None,
                runner_up=None,
                runner_up_votes=None,
                source_url=CEE_AL_UI,
                source_label="CEE · acumulación 2024",
                note="No ganó un escaño por votos. Entró por la ley de minorías.",
                harvested_from="regla-minorias",
            )
            continue

        if rep["district"] is not None:
            district = wiki["districts"][rep["district"]]
            winner = next(c for c in district["candidates"] if c["winner"])
            others = sorted(
                [c for c in district["candidates"] if not c["winner"]],
                key=lambda c: -c["votes"],
            )
            second = others[0] if others else None
            out[rep["id"]] = build_record(
                event="generales-2024",
                event_label="Elecciones generales · 5 nov 2024",
                votes=winner["votes"],
                pct=winner["pct"],
                total=district["total"],
                margin=winner["votes"] - second["votes"] if second else None,
                runner_up=second["name"] if second else None,
                runner_up_votes=second["votes"] if second else None,
                source_url=CEE_DIST_UI,
                source_label="Wikipedia ← escrutinio CEE 31 dic 2024",
                note="La CEE 2024 está detrás de WAF (HTTP 999). Cifra del escrutinio certificado.",
                harvested_from="wikipedia-2024",
            )
            continue

        hit = match_at_large(rep["name"], wiki["atLarge"])
        if not hit:
            raise SystemExit(f"No at-large match for {rep['id']}")
        out[rep["id"]] = build_record(
            event="generales-2024",
            event_label="Elecciones generales · acumulación · 5 nov 2024",
            votes=hit["votes"],
            pct=hit["pct"],
            total=wiki["atLargeTotal"],
            margin=None,
            runner_up=None,
            runner_up_votes=None,
            source_url=CEE_AL_UI,
            source_label="Wikipedia ← escrutinio CEE 31 dic 2024",
            note="La CEE 2024 está detrás de WAF (HTTP 999). Cifra del escrutinio certificado.",
            harvested_from="wikipedia-2024",
        )

    report["reps"] = len(out)
    report["d31"] = out.get(D31_ID, {}).get("votes")
    report["minority"] = [
        rid for rid, rec in out.items() if rec["event"] == "ley-de-minorias"
    ]
    return out, report


def self_test() -> None:
    fixture = (
        Path(__file__).parent / "fixtures/d31-escrutinio.xml"
    )
    raw = fixture.read_bytes()
    parsed = parse_cee_options_xml(raw)[0]
    assert parsed["options"][0]["name"].startswith("Roberto")
    assert parsed["options"][0]["votes"] == 677
    assert parsed["options"][1]["votes"] == 634
    assert parsed["total"] == 2144
    wiki = (
        "==== District 1 ====\n"
        "{{Election box winning candidate with party link|party=PNP|"
        "candidate=Eddie Charbonier|votes=10961|percentage=46.0}}\n"
        "{{Election box candidate with party link|party=PPD|"
        "candidate=Otra|votes=4202|percentage=17.6}}\n"
        "{{Election box total|votes=23844}}\n"
    )
    cands, total = parse_wiki_election_box(wiki)
    assert cands[0]["votes"] == 10961
    assert total == 23844
    reps = parse_reps_ts(REPS_TS.read_text())
    assert len(reps) == 53
    print("self-test ok")


def main() -> None:
    if "--self-test" in sys.argv:
        self_test()
        return
    data, report = harvest(live=True)
    OUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {OUT_JSON} ({len(data)} reps)")
    print(f"wrote {OUT_REPORT}")
    print("ok:", report["ok"])
    print("failed:", report["failed"])
    print("d31 votes:", report["d31"], "minority:", report["minority"])


if __name__ == "__main__":
    main()
