#!/usr/bin/env python3
"""Empareja a cada titular actual con su fila de 2020 en el escrutinio CEE.

Fuente: wikitexto de Wikipedia que cita
https://elecciones2020.ceepur.org/Noche_del_Evento_92/ (noche del evento).
El 2024 del repo es el certificado (31 dic 2024). No se compara escaño distinto
(distrito vs acumulación) como si fuera el mismo % .
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from harvest_votes import (  # noqa: E402
    UA,
    fold,
    parse_reps_ts,
    parse_wiki_election_box,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/data/votes-2020.json"
REPS_TS = ROOT / "src/data/representatives.ts"
WIKI_2020 = (
    "https://en.wikipedia.org/w/api.php?action=parse"
    "&page=2020_Puerto_Rico_House_of_Representatives_election"
    "&prop=wikitext&format=json"
)
CEE_2020_DIST = (
    "https://elecciones2020.ceepur.org/Noche_del_Evento_92/index.html"
    "#en/default_list/REPRESENTANTES_POR_DISTRITO_Distritos_Representativos.xml"
)
CEE_2020_AL = (
    "https://elecciones2020.ceepur.org/Noche_del_Evento_92/index.html"
    "#en/pic_bar_list/REPRESENTANTES_POR_ACUMULACION_Resumen.xml"
)

STOP = {
    "maria",
    "jose",
    "luis",
    "angel",
    "carlos",
    "juan",
    "ana",
    "rosa",
    "cruz",
    "torres",
    "rivera",
    "hernandez",
    "rodriguez",
    "gonzalez",
    "perez",
    "ramos",
    "ortiz",
    "lopez",
    "santiago",
}


def fetch_wiki() -> str:
    req = urllib.request.Request(WIKI_2020, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.loads(response.read().decode())
    return payload["parse"]["wikitext"]["*"]


def parse_2020(text: str) -> dict:
    parts = re.split(r"\n==== Representative District (\d+) ====\n", text)
    districts: dict[int, dict] = {}
    for i in range(1, len(parts), 2):
        number = int(parts[i])
        cands, total = parse_wiki_election_box(parts[i + 1])
        districts[number] = {"candidates": cands, "total": total}
    at_src = parts[0][parts[0].find("=== At-large") :]
    at_large, at_total = parse_wiki_election_box(at_src)
    return {"districts": districts, "atLarge": at_large, "atLargeTotal": at_total}


def all_candidates(wiki: dict) -> list[dict]:
    rows: list[dict] = []
    for number, district in wiki["districts"].items():
        for cand in district["candidates"]:
            rows.append({**cand, "kind": "distrito", "district": number})
    for cand in wiki["atLarge"]:
        rows.append({**cand, "kind": "acumulacion", "district": None})
    return rows


def tokens(name: str) -> set[str]:
    return {
        tok
        for tok in fold(name).split()
        if len(tok) > 3 and tok not in STOP
    }


def match_person(rep: dict, rows: list[dict]) -> dict | None:
    mine = tokens(rep["name"])
    if not mine:
        return None
    best = None
    best_score = 0
    for row in rows:
        hit = len(mine & tokens(row["name"]))
        if hit > best_score:
            best_score = hit
            best = row
    if best_score >= 2:
        return best
    # un token distintivo (Méndez, Yashira, Charbonier…)
    if best_score == 1 and best and len(mine) <= 2:
        distinctive = mine - {"chino", "junior", "rey"}
        if distinctive and distinctive <= tokens(best["name"]):
            return best
    return None


def main() -> None:
    reps = parse_reps_ts(REPS_TS.read_text())
    wiki = parse_2020(fetch_wiki())
    rows = all_candidates(wiki)
    out: dict[str, dict] = {}
    unmatched: list[str] = []
    for rep in reps:
        hit = match_person(rep, rows)
        if not hit:
            unmatched.append(rep["id"])
            continue
        same_kind = (rep["district"] is None) == (hit["kind"] == "acumulacion")
        if rep["district"] is not None and hit["district"] not in (None, rep["district"]):
            same_kind = False
        out[rep["id"]] = {
            "year": 2020,
            "name": hit["name"],
            "votes": hit["votes"],
            "pct": hit["pct"],
            "winner": hit["winner"],
            "kind": hit["kind"],
            "district": hit["district"],
            "comparable": same_kind,
            "sourceUrl": CEE_2020_AL if hit["kind"] == "acumulacion" else CEE_2020_DIST,
            "sourceLabel": "CEE · noche del evento 3 nov 2020 (vía Wikipedia)",
        }
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(f"matched {len(out)} / {len(reps)}")
    print("unmatched", unmatched)


if __name__ == "__main__":
    main()
