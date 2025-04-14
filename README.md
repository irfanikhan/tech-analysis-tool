# Training Evaluation App

This app allows admins to upload an Excel file containing employee ratings for different technologies and categorizes the employees into two lists:

1. **Resources Needing Training** (rating < 5)
2. **Resources Eligible to Train** (rating > 6)

These are further filtered by technology and can be downloaded as Excel files. The UI is tab-based, paginated, and responsive.

---

## 🛠 Development Setup

### 1. Clone the repository:
```bash
git clone <your-repo-url>
cd dev-resources-analysis
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 📦 Installed Packages

- `react`
- `next`
- `tailwindcss`
- `clsx`
- `tailwind-merge`
- `xlsx` — for reading and exporting Excel files

---

## 📁 Project Structure

```
/components
  /ui
    - card.tsx
    - table.tsx
    - button.tsx
    - tabs.tsx
    - input.tsx
/lib
  - utils.ts
/app
  - page.tsx (Main app logic)
```

---

## 🧱 Components Overview

### 📄 Card
Reusable wrapper container for sections.

```tsx
<Card>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

### 📄 Table
UI table with reusable headers and rows.
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>...</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>...</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 📄 Button
Styled button component.
```tsx
<Button>Download Excel</Button>
```

### 📄 Tabs
Custom tab components to switch between training and trainers.
```tsx
<Tabs defaultValue="training">
  <TabsList>
    <TabsTrigger value="training">Training Needed</TabsTrigger>
    <TabsTrigger value="trainers">Eligible Trainers</TabsTrigger>
  </TabsList>
  <TabsContent value="training">...</TabsContent>
  <TabsContent value="trainers">...</TabsContent>
</Tabs>
```

### 📄 Input
File input to upload Excel sheet.
```tsx
<Input type="file" accept=".xlsx, .xls" />
```

---

## 🧠 Utility Functions

### lib/utils.ts
Contains `cn` function to conditionally merge class names using `clsx` and `tailwind-merge`.

```ts
import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## ✅ Features
- Upload Excel files and parse ratings.
- Filter by technology.
- Two separate tabs for training needs and trainers.
- Excel export functionality with ratings.
- Pagination for long lists.

---

## 📤 Excel Format
The uploaded Excel file should have columns like:

- Full Name
- Email Address
- Employee ID
- Rate your JavaScript skills
- Rate your React skills
- Rate your NodeJS skills

---

## 📬 Contributions
Feel free to fork and create PRs. Feedback is welcome!

