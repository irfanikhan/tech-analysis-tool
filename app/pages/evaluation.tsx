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
import SortIcon from "@/components/ui/sort";
import { getExperience, getSortedData } from "@/lib/utils";
import { TechData } from "@/types/techData";
import { Person } from "@/types/person";

export default function TrainingEvaluator() {
  const [trainingData, setTrainingData] = useState<TechData<Person>>({});
  const [trainerData, setTrainerData] = useState<TechData<Person>>({});
  const [selectedTech, setSelectedTech] = useState<string>("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [tab, setTab] = useState<string>("training");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Person;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Person) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

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

      const trainingCategories: TechData<Person> = {};
      const trainerCategories: TechData<Person> = {};

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
    const sortedData = getSortedData(data, sortConfig);
    const currentData = sortedData.slice(indexOfFirst, indexOfLast);
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
                <TableHead
                  onClick={() => handleSort("name")}
                  className="w-12 cursor-pointer select-none"
                >
                  Name <SortIcon column="name" sortConfig={sortConfig} />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("email")}
                  className="w-11 cursor-pointer select-none"
                >
                  Email <SortIcon column="email" sortConfig={sortConfig} />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("employeeId")}
                  className="w-7 cursor-pointer select-none"
                >
                  Employee ID{" "}
                  <SortIcon column="employeeId" sortConfig={sortConfig} />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("hasExperience")}
                  className="w-9 cursor-pointer select-none"
                >
                  Has Experience{" "}
                  <SortIcon column="hasExperience" sortConfig={sortConfig} />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("rating")}
                  className="w-4 cursor-pointer select-none"
                >
                  Rating <SortIcon column="rating" sortConfig={sortConfig} />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("experience")}
                  className="w-5 cursor-pointer select-none"
                >
                  Experience{" "}
                  <SortIcon column="experience" sortConfig={sortConfig} />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("compositeScore")}
                  className="w-4 cursor-pointer select-none"
                >
                  Score{" "}
                  <SortIcon column="compositeScore" sortConfig={sortConfig} />
                </TableHead>
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

      <div className="max-w-7xl mx-auto">
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
