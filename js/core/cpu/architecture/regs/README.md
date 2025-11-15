# Register Bank Format Specification

Dokumentacija formata za definisanje registarskih banki u arhitekturi procesora.

## Lokacija

Registarske banke se definišu u:
```
/src/architecture-types.js
```

Kao deo `architectureTypes` objekta, gde ključ je tip arhitekture (npr. 'one-addr').

## Svrha

Definicije registarskih banki se učitavaju u `RegisterBank` klasu i vezuju za konkretnu procesorsku arhitekturu.

## Struktura

Svaka arhitektura sadrži niz grupa registara, gde svaka grupa ima:

- **`group`** - naziv grupe registara (npr. "general", "special")
- **`registers`** - niz objekata koji predstavljaju pojedinačne registre

## Atributi registara

### Osnovni atributi

#### `name` (obavezan)
- **Tip:** string
- **Opis:** Jedinstveni identifikator registra
- **Upotreba:**
    - Pristup registru: `registerBank.get(name)`
    - Koristi se kao prikazano ime ako `displayName` nije definisan

#### `displayName` (opciono)
- **Tip:** string (podržava HTML)
- **Opis:** Ime koje se prikazuje korisniku
- **Primer:** `"PSW<br>V C N Z"` - prikazuje PSW u prvom redu i zastavice u drugom

### Atributi prikaza

#### `colspan` (opciono)
- **Tip:** number
- **Default:** 1
- **Opis:** Broj ćelija koje registar zauzima prilikom prikaza
- **Napomena:** Utiče samo na vizuelni prikaz, nema funkcionalnu ulogu

#### `radix` (opciono)
- **Tip:** number
- **Default:** 10
- **Validne vrednosti:**
    - `2` - binarni sistem
    - `8` - oktalni sistem
    - `10` - dekadni sistem
    - `16` - heksadecimalni sistem
- **Opis:** Određuje brojevni sistem za prikaz vrednosti registra
- **Upotreba:** `registerBank.getDisplay(name)` vraća vrednost u odgovarajućem formatu

#### `binaryWidth` (opciono)
- **Tip:** number
- **Opis:** Broj bitova koji se prikazuje sa vodećim nulama
- **Uslov:** Primenjuje se samo kada je `radix === 2`
- **Primer:** Za `binaryWidth: 4`, vrednost 5 se prikazuje kao `0101`

### Atributi pristupa

#### `readonly` (opciono)
- **Tip:** boolean
- **Opis:** Registar samo za čitanje - vrednost se ne može menjati

#### `broken` (opciono)
- **Tip:** boolean
- **Opis:** Neupotrebljiv registar - vrednost se ne može ni čitati ni menjati

## Primer kompletne konfiguracije
```javascript
export const architectureTypes = {
    'one-addr': [
        {
            "group": "general",
            "registers": [
                {"name": "R0"},
                {"name": "R1"},
                {"name": "R2"},
                {"name": "R3"},
                {"name": "R4"},
                {"name": "R5"},
                {"name": "R6"},
                {"name": "R7"}
            ]
        },
        {
            "group": "special",
            "registers": [
                {
                    "name": "ACC",
                    "colspan": 4
                },
                {
                    "name": "PSW",
                    "displayName": "PSW<br>V C N Z",
                    "colspan": 4,
                    "radix": 2,
                    "binaryWidth": 4
                }
            ]
        }
    ]
}
```

## Napomene

- Za detaljnije informacije o implementaciji pogledati `RegisterBank` konstruktor
- Svi nedokumentovani atributi se mogu pronaći u izvornom kodu klase

---

**Verzija dokumentacije:** 2.0  
**Poslednje ažuriranje:** 2025