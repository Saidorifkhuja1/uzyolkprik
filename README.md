# Oʻzyoʻlkoʻprik redesign

Django backend va React frontend asosida qayta yozilgan rasmiy sayt prototipi. Kontent original `uzyulkuprik.uz` sahifalaridagi maʼlumotlarga mos saqlandi, dizayn esa zamonaviy va responsive qilib qurildi.

## Ishga tushirish

Birinchi marta dependency va boshlang‘ich data:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed_site
cd frontend
npm install
```

Keyingi safar backend va frontendni bitta komanda bilan ishga tushirish:

```bash
npm run dev
```

Frontend `http://127.0.0.1:3000` da ochiladi. Vite proxy `/api` so‘rovlarini Django backendga (`127.0.0.1:8000`) uzatadi.

## API

- `GET /api/site/` - saytning to‘liq kontenti
- `GET /api/pages/` - sahifalar ro‘yxati
- `GET /api/pages/<slug>/` - bitta sahifa kontenti
