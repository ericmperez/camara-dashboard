#!/usr/bin/env python3
"""Tres generales por distrito: 2024, 2020 y 2016.

2024: el XML de distrito de la CEE responde 404. Se usa Wikipedia, marcada
como fuente alterna.
2020 y 2016: el XML de la CEE responde 200, con el certificado TLS vencido.
"""

from __future__ import annotations

import json
import re
import ssl
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/data/district-history.json"
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)
INSECURE = ssl._create_unverified_context()

CEE_2024 = (
    "https://elecciones2024.ceepur.org/Escrutinio_General_121/data/"
    "REPRESENTANTES_POR_DISTRITO_Resumen.xml"
)
CEE_2020 = (
    "https://elecciones2020.ceepur.org/Noche_del_Evento_92/data/"
    "REPRESENTANTES_POR_DISTRITO_Distritos_Representativos.xml"
)
CEE_2016 = (
    "https://elecciones2016.ceepur.org/Escrutinio_General_77/data/"
    "REPRESENTANTES_POR_DISTRITO_Distritos_Representativos.xml"
)
WIKI_2024 = "2024_Puerto_Rico_House_of_Representatives_election"


def fetch(url: str, insecure: bool = False) -> tuple[str, bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(
            req, timeout=30, context=INSECURE if insecure else None
        ) as response:
            return f"HTTP {response.status}", response.read()
    except urllib.error.HTTPError as error:
        return f"HTTP {error.code}", error.read()
    except Exception as error:  # noqa: BLE001
        return f"error: {type(error).__name__}", b""


def party_short(party: str) -> str:
    if "New Progressive" in party or "NUEVO PROGRESISTA" in party:
        return "PNP"
    if "Popular Democratic" in party or "POPULAR DEMOCR" in party:
        return "PPD"
    if "Independence" in party or "INDEPENDENTISTA" in party:
        return "PIP"
    if "Dignidad" in party or "Dignity" in party or "DIGNIDAD" in party:
        return "PD"
    if "Victoria" in party or "VICTORIA" in party:
        return "MVC"
    if "Independent" in party or party.strip() in {"IND", "INDPT"}:
        return "IND"
    return "OTRO"


def num(value: str | None) -> int:
    if not value:
        return 0
    return int(value.replace(",", "").strip())


def clean_name(raw: str) -> str:
    raw = re.sub(r"\{\{efn[^}]*\}\}", "", raw)
    raw = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]+)\]\]", r"\1", raw)
    raw = re.sub(r"\([^)]*incumbent[^)]*\)", "", raw, flags=re.I)
    return re.sub(r"\s+", " ", raw).strip(" '")


def parse_cee_xml(body: bytes) -> dict[int, list[dict]]:
    root = ET.fromstring(body)
    districts: dict[int, list[dict]] = {}
    for group in root.findall("group"):
        description = group.findtext("name/description/es") or ""
        match = re.search(r"(\d+)", description)
        if not match:
            continue
        number = int(match.group(1))
        options = []
        for option in group.findall("option"):
            options.append(
                {
                    "name": re.sub(r"\s+", " ", (option.findtext("name/es") or "")).strip(),
                    "votes": num(option.findtext("votes")),
                    "party": (option.findtext("peini/es") or "OTRO").strip(),
                }
            )
        districts[number] = options
    return districts


def parse_wiki_2024(wikitext: str) -> dict[int, list[dict]]:
    districts: dict[int, list[dict]] = {}
    current: int | None = None
    for line in wikitext.splitlines():
        heading = re.match(r"==== (?:Representative )?District (\d+) ====", line)
        if heading:
            current = int(heading.group(1))
            districts[current] = []
            continue
        if current is None:
            continue
        if "Election box winning candidate" not in line and "Election box candidate with party link" not in line:
            continue
        votes = re.search(r"\|votes=([0-9,]+)", line)
        candidate = re.search(r"\|candidate=(.*?)\|votes=", line)
        party = re.search(r"\|party=([^|]+)", line)
        if not votes or not candidate:
            continue
        districts[current].append(
            {
                "name": clean_name(candidate.group(1)),
                "votes": num(votes.group(1)),
                "party": party_short(party.group(1) if party else ""),
            }
        )
    return districts


def fetch_wiki(page: str) -> str:
    url = (
        "https://en.wikipedia.org/w/api.php?action=parse&page="
        + page
        + "&prop=wikitext&format=json"
    )
    status, body = fetch(url)
    if not status.startswith("HTTP 200"):
        raise SystemExit(f"Wikipedia {page}: {status}")
    payload = json.loads(body.decode())
    return payload["parse"]["wikitext"]["*"]


def as_row(year: int, cands: list[dict], source_url: str, source_label: str, alternate: bool, cee_url: str, cee_status: str) -> dict:
    ranked = sorted(cands, key=lambda item: item["votes"], reverse=True)
    winner, second = ranked[0], ranked[1]
    return {
        "year": year,
        "winner": winner["name"],
        "winnerParty": winner["party"],
        "winnerVotes": winner["votes"],
        "second": second["name"],
        "secondParty": second["party"],
        "secondVotes": second["votes"],
        "total": sum(item["votes"] for item in ranked),
        "sourceUrl": source_url,
        "sourceLabel": source_label,
        "alternate": alternate,
        "ceeUrl": cee_url,
        "ceeStatus": cee_status,
    }


def require_forty(districts: dict[int, list[dict]], label: str) -> None:
    missing = [number for number in range(1, 41) if len(districts.get(number, [])) < 2]
    if missing:
        raise SystemExit(f"{label} sin segundo lugar en {missing}")


def main() -> None:
    status_2024, body_2024 = fetch(CEE_2024)
    status_2020, body_2020 = fetch(CEE_2020, insecure=True)
    status_2016, body_2016 = fetch(CEE_2016, insecure=True)
    if not body_2024.startswith(b"<?xml"):
        status_2024 = status_2024 if status_2024 != "HTTP 200" else "HTTP 200 sin XML"
    if not body_2020.startswith(b"<?xml"):
        raise SystemExit(f"2020 no es XML: {status_2020}")
    if not body_2016.startswith(b"<?xml"):
        raise SystemExit(f"2016 no es XML: {status_2016}")

    wiki = parse_wiki_2024(fetch_wiki(WIKI_2024))
    require_forty(wiki, "2024")
    cee_2020 = parse_cee_xml(body_2020)
    cee_2016 = parse_cee_xml(body_2016)
    require_forty(cee_2020, "2020")
    require_forty(cee_2016, "2016")

    tls = "HTTP 200; certificado TLS vencido"
    by_district: dict[str, list[dict]] = {}
    for number in range(1, 41):
        by_district[str(number)] = [
            as_row(
                2024,
                wiki[number],
                f"https://en.wikipedia.org/wiki/{WIKI_2024}",
                f"Wikipedia · Cámara 2024 (CEE distrito: {status_2024})",
                True,
                CEE_2024,
                status_2024,
            ),
            as_row(
                2020,
                cee_2020[number],
                CEE_2020,
                "CEE · noche del evento 3 nov 2020",
                False,
                CEE_2020,
                tls,
            ),
            as_row(
                2016,
                cee_2016[number],
                CEE_2016,
                "CEE · escrutinio general 2016",
                False,
                CEE_2016,
                tls,
            ),
        ]

    payload = {
        "events": [2024, 2020, 2016],
        "note": (
            "2024 sale de Wikipedia porque REPRESENTANTES_POR_DISTRITO_Resumen.xml "
            "responde 404. 2020 y 2016 salen del XML de la CEE; el certificado TLS "
            "de esos hosts está vencido y el cuerpo igual es el escrutinio."
        ),
        "ceeProbe": {
            "2024": {"url": CEE_2024, "status": status_2024, "alternate": True},
            "2020": {"url": CEE_2020, "status": tls, "alternate": False},
            "2016": {"url": CEE_2016, "status": tls, "alternate": False},
        },
        "districts": by_district,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    d31 = by_district["31"][0]
    print("wrote", OUT)
    print("probes", status_2024, tls)
    print("D31 2024", d31["winner"], d31["winnerVotes"], "vs", d31["second"], d31["secondVotes"])


if __name__ == "__main__":
    main()
