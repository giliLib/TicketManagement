# Ticket Management 

מערכת לניהול קריאות שירות, הכוללת צד שרת ב־ASP.NET Core 8 וצד לקוח ב־React ו־TypeScript.

## הוראות הרצה

**דרישות מקדימות:** .NET 8 SDK, Node.js ו־npm.

### 1. הפעלת השרת

מתיקיית הפרויקט הראשית:

```bash
cd backend
dotnet restore
dotnet run --project TicketManagement.Api --urls http://0.0.0.0:5000
```

Swagger: http://localhost:5000/swagger

### 2. הפעלת צד הלקוח

בטרמינל נוסף, מתיקיית הפרויקט הראשית:

```bash
cd frontend
npm install
npm run dev
```

כתובת המערכת: http://localhost:5173

### 3. הרצת בדיקות

```bash
cd backend
dotnet test
```

**הערה:** המערכת משתמשת ב־SQLite. בהרצה ראשונה יש לוודא שמסד הנתונים נוצר באמצעות ה־Migrations של Entity Framework Core.
