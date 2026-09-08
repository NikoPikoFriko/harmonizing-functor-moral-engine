# Własny język scenariuszy — kierunek eksperymentu

## W jakich językach kodujemy w tym repozytorium?

Obecny stos technologiczny naturalnie wspiera:

- **TypeScript i TSX** — logikę aplikacji, komponenty React, routing i silnik moralny;
- **CSS** — wygląd i animacje interfejsu;
- **SQL** — migracje i strukturę danych;
- **JavaScript (ESM)** — krótkie skrypty uruchomieniowe, migracyjne i testy przeglądarkowe;
- **JSON i Markdown** — dane, dokumentację oraz przenośne artefakty eksperymentów.

Możliwe jest dodanie innych języków, jeżeli zapewnimy dla nich środowisko wykonawcze
lub etap kompilacji. Przykładowo Rust może kompilować się do WebAssembly, a Python
może działać jako osobna usługa. Nie warto jednak dodawać nowej technologii bez
konkretnej potrzeby produktu.

## Czy możemy stworzyć własny język?

Tak. Najlepszym pierwszym krokiem nie jest pełny język programowania ogólnego
przeznaczenia, lecz mały **DSL** (domain-specific language) służący do zapisywania
scenariuszy, wartości i decyzji. Robocza nazwa: **EtykaScript**.

Przykładowy zapis:

```text
scenariusz "Klasyczny wagonik" {
  tor_glowny: 5 osob
  tor_boczny: 1 osoba

  wartosc zycie = 10
  wartosc autonomia = 8

  wybor przestaw_zwrotnice {
    skutek: ocal 5
    koszt: narusz autonomie 1
  }
}
```

Taki tekst nie powinien być wykonywany bezpośrednio. Parser przekształci go do
wersjonowanego modelu danych, a istniejący silnik TypeScript sprawdzi poprawność i
policzy jawny, możliwy do zakwestionowania wynik. Użytkownik zachowa możliwość
odrzucenia rekomendacji albo zmiany wag.

## Minimalna architektura

1. **Tokenizer** rozpoznaje słowa kluczowe, liczby, tekst i nawiasy.
2. **Parser** buduje AST (abstrakcyjne drzewo składniowe).
3. **Walidator** odrzuca nieznane pola, błędne zakresy oraz niepełne scenariusze.
4. **Kompilator** mapuje AST na istniejące typy domenowe TypeScript/JSON.
5. **Interpreter** uruchamia wyłącznie dozwolone operacje silnika moralnego.
6. **Diagnostyka** pokazuje błąd z numerem wiersza i propozycją poprawki.

## Zasady bezpieczeństwa i przejrzystości

- Brak dostępu DSL do sieci, plików, poleceń systemowych i dynamicznego JavaScriptu.
- Deterministyczny wynik dla tych samych danych wejściowych oraz wersji silnika.
- Jawny ślad: wejście → AST → reguły → rezultat.
- Limity rozmiaru, głębokości zagnieżdżeń i czasu wykonania.
- Wersjonowanie gramatyki oraz migracja starszych scenariuszy.
- Czytelne rozróżnienie między wynikiem algorytmu a decyzją człowieka.

## Proponowane etapy

### Etap 1 — pionowy prototyp

Obsłużyć jeden scenariusz, uczestników, wartości i dwa wybory. Parser można napisać
bez dodatkowych zależności, aby szybko zweryfikować składnię.

### Etap 2 — narzędzia autora

Dodać edytor z podświetlaniem, komunikaty błędów, podgląd wygenerowanego JSON-u i
testy typu „tekst wejściowy → AST → wynik”.

### Etap 3 — stabilizacja

Opublikować gramatykę, wersjonowany format AST, zestaw przykładów i ograniczone API
rozszerzeń. Dopiero wtedy rozważyć WebAssembly lub samodzielne narzędzie CLI.

## Kryterium powodzenia

Pierwsza wersja będzie użyteczna, jeśli osoba nietechniczna zapisze nowy dylemat bez
edycji kodu React/TypeScript, zobaczy zrozumiałe błędy i będzie mogła prześledzić,
dlaczego silnik przedstawił dany rezultat.
