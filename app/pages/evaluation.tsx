"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import ToggleTheme from "@/components/toggleTheme/toggle";
import { DragAndDropFileUpload } from "@/components/dndFileUplaod/dndFileUpload";

type Person = {
  name: string;
  email: string;
  employeeId: string | number;
  rating: number;
  experience: number;
  hasExperience: string;
  compositeScore: number;
};

type TechData = {
  [tech: string]: Person[];
};

// Helper to normalize tech names
function normalizeTechName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.js$/, "") // remove ".js"
    .replace(/[^a-z0-9]/gi, "") // remove non-alphanumeric
    .trim();
}

function getExperience(
  row: Record<string, string | number>,
  tech: string
): { experience: number; hasExperience: string } {
  const normalizedTech = normalizeTechName(tech);

  const experienceKey = Object.keys(row).find((key) => {
    const normalizedKey = normalizeTechName(key);
    return (
      normalizedKey.includes("yearsofexperience") &&
      normalizedKey.includes(normalizedTech)
    );
  });

  const experienceStr = experienceKey ? row[experienceKey] : 0;
  const experience = parseFloat(experienceStr as string) || 0;

  const hasExpKey = Object.keys(row).find((key) => {
    const normalizedKey = normalizeTechName(key);
    return (
      normalizedKey.includes("doyouhaveexperience") &&
      normalizedKey.includes(normalizedTech)
    );
  });

  const hasExperience =
    hasExpKey && row[hasExpKey]?.toString().toLowerCase() === "yes"
      ? "Yes"
      : "No";

  return { experience, hasExperience };
}

export default function TrainingEvaluator() {
  const [trainingData, setTrainingData] = useState<TechData>({});
  const [trainerData, setTrainerData] = useState<TechData>({});
  const [selectedTech, setSelectedTech] = useState<string>("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [tab, setTab] = useState<string>("training");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const selectedTab = localStorage.getItem("selectedTab");
    const tech = localStorage.getItem("selectedTech");

    if (tech) setSelectedTech(tech);
    if (selectedTab) setTab(selectedTab);
  }, []);

  const handleFileUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json =
        XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet);

      const trainingCategories: TechData = {};
      const trainerCategories: TechData = {};

      json.forEach((row) => {
        const name = row["Full Name"] as string;
        const email = row["Email Address"] as string;
        const employeeId = row["Employee ID"] as string;

        Object.entries(row).forEach(([key, value]) => {
          const match = key.match(/rate your (.+?) skills/i);

          if (match) {
            console.log(row);
            const tech = match[1].trim();
            const rating = parseFloat(value as string);
            const { experience, hasExperience } = getExperience(row, tech);

            const compositeScore = rating * 0.6 + experience * 0.4;

            const person: Person = {
              name,
              email,
              employeeId,
              rating,
              experience,
              compositeScore,
              hasExperience,
            };

            if (!trainingCategories[tech]) trainingCategories[tech] = [];
            if (!trainerCategories[tech]) trainerCategories[tech] = [];

            if (compositeScore < 5) trainingCategories[tech].push(person);
            else if (compositeScore > 7) trainerCategories[tech].push(person);
          }
        });
      });

      setTrainingData(trainingCategories);
      setTrainerData(trainerCategories);
      const allTechs = [
        ...new Set([
          ...Object.keys(trainingCategories),
          ...Object.keys(trainerCategories),
        ]),
      ];
      setTechnologies(allTechs);

      const prevSelectedTech = localStorage.getItem("selectedTech");
      if (prevSelectedTech && allTechs.includes(prevSelectedTech)) {
        setSelectedTech(prevSelectedTech);
      } else {
        const firstTech = allTechs[0] || "";
        setSelectedTech(firstTech);
        localStorage.setItem("selectedTech", firstTech);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadExcel = (data: Person[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const renderTable = (title: string, data: Person[]) => {
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = data.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
      <Card className="mt-4 rounded-0 border-0 shadow-none">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button onClick={() => downloadExcel(data, title)}>
              Download Excel
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Has Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Composite Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((person, index) => (
                <TableRow key={index}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>{person.employeeId}</TableCell>
                  <TableCell>{person.hasExperience}</TableCell>
                  <TableCell>{person.rating}</TableCell>
                  <TableCell>{person.experience}</TableCell>
                  <TableCell>{person.compositeScore.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.length > rowsPerPage && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex justify-end mb-2">
        <ToggleTheme />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-3xl font-bold text-left">
            Resources Training Evaluation
          </h1>
          <DragAndDropFileUpload
            onFileSelect={handleFileUpload}
            className="w-72 m-3"
          />
        </div>

        {technologies.length > 0 && (
          <Card className="mt-8">
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium dark:text-white">
                  Select Technology:
                </label>
                <select
                  className="border p-2.5 rounded-lg dark:bg-gray-800 dark:text-white border-gray-200 dark:border-gray-600"
                  value={selectedTech}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedTech(selected);
                    localStorage.setItem("selectedTech", selected);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Select Technology</option>
                  {technologies.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger
                    value="training"
                    selected={tab === "training"}
                    onClick={() => {
                      setTab("training");
                      localStorage.setItem("selectedTab", "training");
                      setCurrentPage(1);
                    }}
                  >
                    Needs Training
                  </TabsTrigger>
                  <TabsTrigger
                    value="trainer"
                    selected={tab === "trainer"}
                    onClick={() => {
                      setTab("trainer");
                      localStorage.setItem("selectedTab", "trainer");
                      setCurrentPage(1);
                    }}
                  >
                    Eligible Trainers
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="training" selected={tab === "training"}>
                  {selectedTech &&
                    trainingData[selectedTech]?.length > 0 &&
                    renderTable(
                      `Resources Needing ${selectedTech} Training`,
                      trainingData[selectedTech]
                    )}
                </TabsContent>
                <TabsContent value="trainer" selected={tab === "trainer"}>
                  {selectedTech &&
                    trainerData[selectedTech]?.length > 0 &&
                    renderTable(
                      `Trainers for ${selectedTech}`,
                      trainerData[selectedTech]
                    )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
