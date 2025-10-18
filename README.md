# Flight-Planner-VFR
FPL VFR – opis projektu

FPL VFR to webowa aplikacja, która pomaga pilotowi zaplanować lot VFR i wydrukować Operacyjny Plan Lotu (OPL). Wszystko w jednym miejscu: trasa na mapie, automatyczne przeliczenia, pogoda, NOTAM-y i szybki eksport do PDF.

Możliwości
1) Trasa na mapie
Dodawanie punktów trasy kliknięciem.
Automatyczne wyznaczanie odcinków i kierunków.
Edycja kolejności punktów, usuwanie, podgląd całej trasy.

2) Automatyczne obliczenia
TC / MC / WCA / HDG / GS / ETE dla każdego odcinka.
Sumy całkowite: dystans i przewidywany czas lotu.
Szacunkowe zużycie paliwa (przelot, taxi, rezerwy).

3) Pogoda w jednej karcie
METAR i TAF dla lotnisk startu i docelowego w czytelnym, „ludzkim” widoku.
GAMET (IMGW) – wiatr (kierunek/prędkość) dla wybranej warstwy/pułapu, używany w obliczeniach.
Ostrzeżenia, gdy pogoda nie spełnia podstawowych założeń VFR.

4) Komunikaty i informacje lotnicze
NOTAM dla lotnisk z trasy – lista najważniejszych ograniczeń.
AIP (seed) – podstawowe dane lotnisk (pasy, długości, orientacja), podpowiedź „pas pod wiatr”.

5) Samolot i wyważenie
Prosty moduł Weight & Balance (np. C152): masa pilot/pax, paliwo, bagaż → CG, MTOW, informacja „w normie/poza”.
Profil samolotu zapisywany do późniejszego użycia.

6) Operacyjny Plan Lotu (PDF)
Generowanie gotowego OPL z wypełnionymi polami (trasa, czasy, paliwo, lotniska).
Wersja do druku lub zapisu.

Technologie:

-Frontend (WEB): Next.js (React)
-Backend (API): NestJS (Node.js 20), PostgreSQL (Prisma ORM), RabbitMQ (kolejki), Swagger/OpenAPI.

Prototyp
![alt text](image.png)