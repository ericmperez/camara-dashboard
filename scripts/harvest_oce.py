#!/usr/bin/env python3
"""Recaudos publicados del comité de campaña de cada representante PNP.

Fuente: Consulta de informes de la OCE (serviciosenlinea.oce.pr.gov), informes
de ingresos y gastos ya publicados. No es el balance acumulado: ese tablero
está en Power BI y no tiene export público.

Empareja por nombre. No inventa un comité si no hay dos tokens en común.
"""

from __future__ import annotations

import json
import re
import unicodedata
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPS = ROOT / "src/data/representatives.ts"
OUT = ROOT / "src/data/oce.json"
BASE = "https://serviciosenlinea.oce.pr.gov"
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)
STOP = {
    "de",
    "del",
    "los",
    "las",
    "para",
    "por",
    "con",
    "una",
    "unos",
    "junior",
    "amigo",
    "amigos",
    "comite",
    "campana",
}

# Emparejes que el token suelto confunde con otro comité homónimo.
OVERRIDES = {
    "carlos-johnny-mendez-nunez": "75",
    "jose-e-torres-zamora": None,  # filled after listing if the automatic score is unique
}


def fold(value: str) -> str:
    value = unicodedata.normalize("NFD", value.lower())
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^a-z0-9 ]+", " ", value)


def tokens(value: str) -> set[str]:
    return {tok for tok in fold(value).split() if len(tok) > 3 and tok not in STOP}


class Session:
    def __init__(self) -> None:
        self.jar = ""
        self.token = ""
        self.open()

    def open(self) -> None:
        req = urllib.request.Request(
            BASE + "/PublishedTransaction/Search",
            headers={"User-Agent": UA},
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            body = response.read().decode("utf-8", "replace")
            cookie = response.headers.get_all("Set-Cookie") or []
        self.jar = "; ".join(part.split(";", 1)[0] for part in cookie)
        match = re.search(
            r'name="__RequestVerificationToken"[^>]*value="([^"]+)"',
            body,
        )
        if not match:
            raise SystemExit("OCE no entregó el token antifalsificación")
        self.token = match.group(1)

    def get(self, path: str) -> object:
        req = urllib.request.Request(
            BASE + path,
            headers={"User-Agent": UA, "Cookie": self.jar},
        )
        with urllib.request.urlopen(req, timeout=40) as response:
            return json.loads(response.read().decode())

    def post(self, path: str, fields: dict[str, str]) -> dict:
        fields = {"__RequestVerificationToken": self.token, **fields}
        data = urllib.parse.urlencode(fields).encode()
        req = urllib.request.Request(
            BASE + path,
            data=data,
            headers={
                "User-Agent": UA,
                "Cookie": self.jar,
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest",
            },
        )
        with urllib.request.urlopen(req, timeout=40) as response:
            return json.loads(response.read().decode())


def parse_reps() -> list[dict]:
    text = REPS.read_text()
    blocks = re.split(r"\n  \{", text)[1:]
    reps = []
    for block in blocks:
        name_match = re.search(
            r"name:\s*(?:'((?:\\'|[^'])*)'|\"((?:\\\"|[^\"])*)\")",
            block,
        )
        name = (name_match.group(1) or name_match.group(2)).replace("\\'", "'")
        party = re.search(r"party: '([^']+)'", block).group(1)
        if party != "PNP":
            continue
        reps.append(
            {
                "id": re.search(r"id: '([^']+)'", block).group(1),
                "name": name,
            }
        )
    return reps


def dotnet_date(value: str | None) -> str | None:
    if not value:
        return None
    match = re.search(r"Date\((-?\d+)\)", value)
    if not match:
        return None
    moment = datetime.fromtimestamp(int(match.group(1)) / 1000, tz=timezone.utc)
    return moment.date().isoformat()


def choose(rep: dict, committees: list[dict]) -> dict | None:
    override = OVERRIDES.get(rep["id"])
    if override:
        for committee in committees:
            if str(committee["Value"]) == override:
                return committee
    mine = tokens(rep["name"])
    ranked = []
    for committee in committees:
        text = committee["Text"]
        folded = fold(text)
        if "antes de" in folded and "transferencia" in folded:
            continue
        score = len(mine & tokens(text))
        if score >= 2:
            active = 0 if "inactivo" in folded else 1
            ranked.append((score, active, committee))
    if not ranked:
        return None
    ranked.sort(key=lambda item: (item[0], item[1]), reverse=True)
    best = ranked[0][0]
    tied = [committee for score, active, committee in ranked if score == best and active == 1]
    if len(tied) == 1:
        return tied[0]
    if not tied:
        inactive = [committee for score, active, committee in ranked if score == best]
        return inactive[0] if len(inactive) == 1 else None
    return None


def sum_lines(session: Session, path: str, report_id: int) -> float:
    total_amount = 0.0
    page = 1
    total_rows = None
    seen = 0
    while True:
        payload = session.post(
            path,
            {
                "transactionReportId": str(report_id),
                "page": str(page),
                "pageSize": "100",
            },
        )
        rows = payload.get("Data") or []
        if total_rows is None:
            total_rows = int(payload.get("Total") or len(rows))
        for row in rows:
            total_amount += float(row.get("Amount") or 0)
        seen += len(rows)
        if seen >= total_rows or not rows:
            break
        page += 1
    return round(total_amount, 2)


def latest_report(session: Session, committee_id: str) -> dict | None:
    payload = session.post(
        "/PublishedTransaction/FillPublishedTransationReportsResultsGrid",
        {
            "transactionReportTypeCode": "1",
            "committeeTypeCode": "1",
            "electivePositionCode": "1",
            "committeeId": committee_id,
            "electoralEventId": "",
            "filingPeriodId": "",
            "loadResult": "true",
            "page": "1",
            "pageSize": "20",
        },
    )
    rows = payload.get("Data") or []
    if not rows:
        return None
    rows.sort(key=lambda row: row.get("FilingDate") or "", reverse=True)
    return rows[0]


def main() -> None:
    session = Session()
    committees = [
        row
        for row in session.get(
            "/PublishedTransaction/FillCommitteeDropDownList?committeeTypeCode=1&electivePositionCode=1"
        )
        if row.get("Value")
    ]
    by_id: dict[str, dict] = {}
    unmatched: list[dict] = []
    ambiguous: list[dict] = []
    for rep in parse_reps():
        mine = tokens(rep["name"])
        ranked = []
        for committee in committees:
            text = committee["Text"]
            if "antes de" in fold(text) and "transferencia" in fold(text):
                continue
            score = len(mine & tokens(text))
            if score >= 2:
                ranked.append((score, committee))
        ranked.sort(key=lambda item: item[0], reverse=True)
        picked = choose(rep, committees)
        if (
            picked is None
            and ranked
            and len([item for item in ranked if item[0] == ranked[0][0]]) > 1
        ):
            ambiguous.append(
                {
                    "id": rep["id"],
                    "name": rep["name"],
                    "options": [item[1]["Text"] for item in ranked if item[0] == ranked[0][0]],
                }
            )
            continue
        if picked is None:
            unmatched.append({"id": rep["id"], "name": rep["name"]})
            continue
        report = latest_report(session, str(picked["Value"]))
        if report is None:
            unmatched.append({"id": rep["id"], "name": rep["name"], "committee": picked["Text"], "reason": "sin informe"})
            continue
        report_id = int(report["TransactionReportId"])
        income = sum_lines(session, "/PublishedTransaction/FillIncomeListGrid", report_id)
        expenses = sum_lines(session, "/PublishedTransaction/FillExpenseListGrid", report_id)
        by_id[rep["id"]] = {
            "committeeId": str(picked["Value"]),
            "committeeName": picked["Text"].strip(),
            "reportId": report_id,
            "reportNumber": report.get("Number"),
            "period": report.get("FilingPeriodDescription"),
            "event": report.get("ElectoralEventDescription"),
            "filedAt": dotnet_date(report.get("FilingDate")),
            "income": income,
            "expenses": expenses,
            "sourceUrl": f"{BASE}/PublishedTransaction/Detail?transactionReportId={report_id}",
        }
        print(f"{rep['id']}: {picked['Text'][:48]} {report.get('Number')} in={income} out={expenses}")

    payload = {
        "checkedAt": datetime.now(timezone.utc).date().isoformat(),
        "searchUrl": BASE + "/PublishedTransaction/Search",
        "balancesUrl": "https://oce.pr.gov/comites-activos/balances-de-ingresos-y-gastos/",
        "note": (
            "Ingresos y gastos son la suma de las partidas publicadas del informe "
            "de ingresos y gastos más reciente de ese comité. No es el balance "
            "acumulado: ese cuadro está en un tablero Power BI de la OCE sin export."
        ),
        "byId": by_id,
        "unmatched": unmatched,
        "ambiguous": ambiguous,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(f"matched {len(by_id)} unmatched {len(unmatched)} ambiguous {len(ambiguous)}")
    print("unmatched", unmatched)
    print("ambiguous", ambiguous)


if __name__ == "__main__":
    main()
