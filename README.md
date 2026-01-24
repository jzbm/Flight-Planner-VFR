# FPL VFR - Flight Planner

Aplikacja webowa do planowania lotow VFR (Visual Flight Rules) z automatycznymi obliczeniami nawigacyjnymi, integracja danych pogodowych METAR/TAF/GAMET, komunikatami NOTAM oraz generowaniem dokumentacji lotniczej (OPL).

---

## Spis tresci

1. [Opis projektu](#opis-projektu)
2. [Architektura systemu](#architektura-systemu)
3. [Stack technologiczny](#stack-technologiczny)
4. [Wymagania systemowe](#wymagania-systemowe)
5. [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
6. [Struktura projektu](#struktura-projektu)
7. [Baza danych](#baza-danych)
8. [API - dokumentacja](#api---dokumentacja)
9. [Funkcjonalnosci](#funkcjonalnosci)
10. [Uwierzytelnianie i autoryzacja](#uwierzytelnianie-i-autoryzacja)
11. [Kolejki asynchroniczne](#kolejki-asynchroniczne)
12. [Testowanie](#testowanie)

---

## Opis projektu

FPL VFR to kompleksowe narzedzie dla pilotow VFR umozliwiajace:

- Planowanie trasy lotu na interaktywnej mapie z wizualizacja stref przestrzeni powietrznej
- Automatyczne obliczenia nawigacyjne (TC, MC, WCA, HDG, GS, ETE, zuzycie paliwa)
- Pobieranie aktualnych danych meteorologicznych z IMGW i CheckWX
- Wyswietlanie komunikatow NOTAM dla lotnisk na trasie
- Obliczenia Weight and Balance z wizualizacja obwiedni CG
- Generowanie Operacyjnego Planu Lotu (OPL) w formacie PDF
- Zarzadzanie flota samolotow z profilami osiagowymi

Projekt realizowany na potrzeby przedmiotu ZTPAI (Zaawansowane Technologie Programowania Aplikacji Internetowych).

---

## Architektura systemu

### Diagram warstw

```
+------------------+     +------------------+     +------------------+
|    FRONTEND      |     |     BACKEND      |     |   ZEWNETRZNE     |
|    (Next.js)     |<--->|    (NestJS)      |<--->|      API         |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        |                        v                        |
        |                +------------------+             |
        |                |   PostgreSQL     |             |
        |                +------------------+             |
        |                        |                        |
        |                        v                        |
        |                +------------------+             |
        |                |    RabbitMQ      |             |
        |                |   (Kolejki)      |             |
        +----------------+------------------+-------------+
```

### Diagram ERD

![ERD Diagram]<img width="1978" height="1634" alt="erd" src="https://github.com/user-attachments/assets/2f59ba6e-35c5-4d34-b8cc-59c2714f1418" />
.png)

Schemat bazy danych zawiera 9 tabel:
- **users** - uzytkownicy systemu z rolami (USER/ADMIN)
- **aircraft** - samoloty z parametrami osiagowymi i W&B
- **airports** - lotniska z danymi geograficznymi i czestotliwosciami
- **runways** - drogi startowe lotnisk
- **flight_plans** - plany lotow VFR
- **waypoints** - punkty nawigacyjne trasy
- **flight_legs** - odcinki trasy z obliczeniami
- **weather_data** - cache danych pogodowych METAR/TAF/GAMET
- **notam_data** - cache komunikatow NOTAM

---

## Stack technologiczny

### Frontend

| Technologia | Wersja | Uzasadnienie |
|-------------|--------|--------------|
| Next.js | 14.x | App Router, SSR/SSG, optymalizacja obrazow, routing |
| React | 18.x | Komponenty funkcyjne, hooks, Suspense |
| TypeScript | 5.x | Statyczne typowanie, lepsza jakosc kodu |
| Tailwind CSS | 3.x | Utility-first CSS, szybkie prototypowanie |
| Zustand | 4.x | Lekki state management, prostszy niz Redux |
| TanStack Query | 5.x | Cache API, automatyczne odswiezanie, retry |
| Leaflet | 1.9.x | Mapy interaktywne, open-source, lekka biblioteka |
| React Hook Form | 7.x | Wydajne formularze, walidacja |

### Backend

| Technologia | Wersja | Uzasadnienie |
|-------------|--------|--------------|
| NestJS | 10.x | Modulowa architektura, DI, dekoratory, TypeScript |
| Prisma | 5.x | Type-safe ORM, migracje, seeding |
| PostgreSQL | 16.x | Relacyjna baza, ACID, JSON support |
| RabbitMQ | 3.x | Message broker, kolejki asynchroniczne |
| Passport.js | 0.7.x | Strategia JWT, elastyczna autoryzacja |
| Swagger | 7.x | Automatyczna dokumentacja OpenAPI |
| PDFKit | 0.13.x | Generowanie dokumentow PDF |

### DevOps

| Technologia | Uzasadnienie |
|-------------|--------------|
| Docker | Konteneryzacja, izolacja srodowisk |
| Docker Compose | Orkiestracja wielokontenerowa |
| GitHub Actions | CI/CD (opcjonalnie) |

---

## Wymagania systemowe

- Node.js
- Docker i Docker Compose (zalecane)
- Git

---

## Instalacja i uruchomienie

### Metoda 1: Docker (zalecana)

```bash
# Klonowanie repozytorium
git clone https://github.com/user/fpl-vfr.git
cd fpl-vfr

# Uruchomienie wszystkich uslug
docker compose up -d

# Wykonanie migracji i seedowania bazy
docker exec fpl-vfr-backend npx prisma migrate deploy
docker exec fpl-vfr-backend npx prisma db seed
```

Aplikacja dostepna pod adresami:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger UI: http://localhost:3001/api/docs
- RabbitMQ Management: http://localhost:15672 (guest/guest)

### Metoda 2: Reczna instalacja

#### Backend

```bash
cd backend
npm install

# Konfiguracja srodowiska
cp .env.example .env
# Edytuj .env i ustaw DATABASE_URL, JWT_SECRET, RABBITMQ_URL

# Migracje bazy danych
npx prisma migrate dev

# Seedowanie danych testowych
npx prisma db seed

# Uruchomienie w trybie developerskim
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install

# Konfiguracja (opcjonalnie)
cp .env.example .env.local

# Uruchomienie
npm run dev
```

### Konta testowe

Po wykonaniu seedowania dostepne sa konta:

| Email | Haslo | Rola |
|-------|-------|------|
| admin@fplvfr.pl | admin123 | ADMIN |
| demo@example.com | demo123 | USER |
| pilot@example.com | demo123 | USER |

---

## Struktura projektu

```
fpl-vfr/
├── backend/                    # Serwer NestJS
│   ├── prisma/
│   │   ├── schema.prisma       # Schemat bazy danych
│   │   ├── seed.ts             # Dane testowe
│   │   └── migrations/         # Migracje SQL
│   ├── src/
│   │   ├── main.ts             # Entry point
│   │   ├── app.module.ts       # Glowny modul
│   │   ├── prisma/             # Modul Prisma
│   │   ├── rabbitmq/           # Konfiguracja RabbitMQ
│   │   └── modules/
│   │       ├── auth/           # Uwierzytelnianie JWT
│   │       ├── users/          # Zarzadzanie uzytkownikami
│   │       ├── aircraft/       # Samoloty
│   │       ├── airports/       # Lotniska
│   │       ├── flight-plans/   # Plany lotow
│   │       ├── weather/        # Dane pogodowe
│   │       ├── weather-queue/  # Kolejka pogody (RabbitMQ)
│   │       ├── notam/          # Komunikaty NOTAM
│   │       ├── calculations/   # Obliczenia nawigacyjne
│   │       ├── airspace/       # Strefy przestrzeni
│   │       └── pdf/            # Generowanie PDF (RabbitMQ)
│   └── test/                   # Testy E2E
├── frontend/                   # Aplikacja Next.js
│   ├── src/
│   │   ├── app/                # App Router (strony)
│   │   ├── components/         # Komponenty React
│   │   ├── lib/                # Konfiguracja API
│   │   └── store/              # Zustand stores
│   └── public/                 # Zasoby statyczne
├── docs/                       # Dokumentacja
│   └── ERD.md                  # Diagram ERD
├── docker-compose.yml          # Konfiguracja Docker
└── README.md
```

---

## Baza danych

### Normalizacja

Schemat bazy danych spelnia trzecia postac normalna (3NF):

- **1NF**: Wszystkie atrybuty sa atomowe (pojedyncze wartosci)
- **2NF**: Kazdy atrybut nie-kluczowy jest w pelni zalezny od klucza glownego
- **3NF**: Brak zaleznosci przechodnich - atrybuty nie-kluczowe zaleza tylko od klucza glownego

### Dane testowe

Seed zawiera 40+ rekordow testowych:
- 4 uzytkownikow (w tym 1 admin)
- 4 samoloty (Cessna 172, Piper PA-28, Diamond DA40, DA42)
- 12 lotnisk polskich (EPWA, EPKK, EPGD, EPWR, EPPO, EPKT, EPLL, EPRA, EPBC, EPMO, EPSN, EPRZ)
- 8 drog startowych
- 3 przykladowe plany lotow z waypointami

### Migracje

```bash
# Tworzenie nowej migracji
npx prisma migrate dev --name nazwa_migracji

# Zastosowanie migracji na produkcji
npx prisma migrate deploy

# Reset bazy (development)
npx prisma migrate reset
```

---

## API - dokumentacja

### Swagger UI

Pelna dokumentacja API dostepna pod adresem: `http://localhost:3001/api/docs`

### Glowne endpointy

#### Uwierzytelnianie

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | /auth/register | Rejestracja nowego uzytkownika |
| POST | /auth/login | Logowanie, zwraca token JWT |
| GET | /auth/profile | Profil zalogowanego uzytkownika |

#### Samoloty

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | /aircraft | Lista samolotow uzytkownika |
| POST | /aircraft | Dodanie nowego samolotu |
| GET | /aircraft/:id | Szczegoly samolotu |
| PUT | /aircraft/:id | Aktualizacja samolotu |
| DELETE | /aircraft/:id | Usuniecie samolotu |
| POST | /aircraft/:id/weight-balance | Obliczenia W&B |

#### Plany lotow

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | /flight-plans | Lista planow lotu |
| POST | /flight-plans | Utworzenie planu |
| GET | /flight-plans/:id | Szczegoly planu |
| PUT | /flight-plans/:id | Aktualizacja planu |
| DELETE | /flight-plans/:id | Usuniecie planu |

#### Pogoda

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | /weather/metar/:icao | METAR dla lotniska |
| GET | /weather/taf/:icao | TAF dla lotniska |
| GET | /weather/gamet/:zone | GAMET dla strefy |
| GET | /weather/briefing/:dep/:arr | Briefing pogodowy |

#### NOTAM

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | /notam/:icao | NOTAMy dla lotniska |
| GET | /notam/:icao/categorized | NOTAMy skategoryzowane |
| POST | /notam/flight-path | NOTAMy dla trasy |

#### PDF (przez kolejke RabbitMQ)

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | /pdf/queue/:id | Kolejkowanie generowania PDF |
| GET | /pdf/status/:id | Status generowania |
| GET | /pdf/download/:id | Pobranie wygenerowanego PDF |

### Kody odpowiedzi

| Kod | Znaczenie |
|-----|-----------|
| 200 | Sukces |
| 201 | Utworzono zasob |
| 400 | Bledne zadanie |
| 401 | Brak autoryzacji |
| 403 | Brak uprawnien |
| 404 | Nie znaleziono |
| 500 | Blad serwera |

---

## Funkcjonalnosci

### Zaimplementowane

1. **Planowanie trasy** - interaktywna mapa z dodawaniem punktow, wizualizacja stref GAMET i przestrzeni powietrznej
2. **Obliczenia nawigacyjne** - automatyczne TC, MC, WCA, HDG, GS, ETE dla kazdego odcinka
3. **Integracja pogodowa** - METAR, TAF z CheckWX API, GAMET z IMGW
4. **Komunikaty NOTAM** - pobieranie i kategoryzacja NOTAMow
5. **Weight and Balance** - obliczenia z wizualizacja obwiedni CG
6. **Generowanie OPL** - PDF zgodny z polskim wzorem Operacyjnego Planu Lotu
7. **Zarzadzanie samolotami** - CRUD z profilami osiagowymi
8. **Zarzadzanie planami** - zapisywanie, edycja, usuwanie planow lotu
9. **System uzytkownikow** - rejestracja, logowanie, role (USER/ADMIN)
10. **Panel administracyjny** - zarzadzanie uzytkownikami (rola ADMIN)
11. **Kolejki asynchroniczne** - generowanie PDF i odswiezanie pogody przez RabbitMQ

### Responsywnosc

Aplikacja jest w pelni responsywna:
- Desktop: pelny uklad z mapa i panelami bocznymi
- Tablet: dostosowany uklad z przesuwanym panelem
- Mobile: nawigacja dolna, mapa na pelny ekran, wysuwane panele

---

## Uwierzytelnianie i autoryzacja

### JWT (JSON Web Token)

- Token generowany przy logowaniu
- Waznosc: 7 dni
- Przesylany w naglowku: `Authorization: Bearer <token>`
- Przechowywany w localStorage

### Role uzytkownikow

| Rola | Uprawnienia |
|------|-------------|
| USER | Zarzadzanie wlasnymi samolotami i planami lotu |
| ADMIN | Pelny dostep + zarzadzanie uzytkownikami |

### Guardy (NestJS)

```typescript
@UseGuards(JwtAuthGuard)           // Wymaga zalogowania
@UseGuards(JwtAuthGuard, AdminGuard) // Wymaga roli ADMIN
```

---

## Kolejki asynchroniczne

### RabbitMQ

Projekt wykorzystuje RabbitMQ do przetwarzania zadan asynchronicznych:

#### Kolejka PDF (fpl_pdf_queue)

- Generowanie dokumentow PDF w tle
- Pattern: `pdf.generate.opl`
- Flow: zadanie -> kolejka -> worker -> zapis pliku -> notyfikacja

#### Kolejka Weather (fpl_weather_queue)

- Automatyczne odswiezanie danych METAR co 30 minut
- Pattern: `weather.refresh.metar`
- Alerty pogodowe przy niskiej widocznosci/pulapie

### Monitoring

RabbitMQ Management UI: http://localhost:15672
- Login: fplvfr
- Haslo: fplvfr_secret

---

## Testowanie

### Testy E2E (Backend)

```bash
cd backend
npm run test:e2e
```

### Testy jednostkowe (Frontend)

```bash
cd frontend
npm run test
```

---

## Licencja

MIT License
