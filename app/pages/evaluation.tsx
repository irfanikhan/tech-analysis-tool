"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Pagination } from "../components/ui/pagination";
import ToggleTheme from "../components/toggleTheme/toggle";

interface Resource {
  name: string;
  email: string;
  employeeId: string;
  rating: string | number;
}

export default function TrainingEvaluation() {
  const [trainingData, setTrainingData] = useState<Record<string, Resource[]>>(
    {}
  );
  const [trainerData, setTrainerData] = useState<Record<string, Resource[]>>(
    {}
  );
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState("");
  const [tab, setTab] = useState("training");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json =
        XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet);

      const training: Record<string, Resource[]> = {};
      const trainers: Record<string, Resource[]> = {};

      json.forEach((row: Record<string, string | number>) => {
        const name = row["Full Name"];
        const email = row["Email Address"];
        const employeeId = row["Employee ID"];

        Object.entries(row).forEach(([key, val]) => {
          const match = key.match(/rate your (.+?) skills/i);
          if (match) {
            const tech = match[1].trim();
            const rating = parseInt(val as string);
            const person = { name, email, employeeId, rating };

            if (!training[tech]) training[tech] = [];
            if (!trainers[tech]) trainers[tech] = [];

            if (rating < 5) training[tech].push(person as Resource);
            if (rating > 6) trainers[tech].push(person as Resource);
          }
        });
      });

      setTrainingData(training);
      setTrainerData(trainers);
      setTechnologies([
        ...new Set([...Object.keys(training), ...Object.keys(trainers)]),
      ]);
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadExcel = (
    data: Record<string, string[]>[],
    filename: string
  ) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const renderTable = (data: Record<string, string[]>[], title: string) => {
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentData = data.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
      <Card className="mt-4 rounded-0 border-0">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
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
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.employeeId}</TableCell>
                  <TableCell>{p.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    );
  };

  // const selectedData =
  //   tab === "training" ? trainingData[selectedTech] : trainerData[selectedTech];

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <ToggleTheme />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-3xl font-bold text-left">
            Resources Training Evaluation
          </h1>
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
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
                    setSelectedTech(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Select</option>
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
                      trainingData[selectedTech] as unknown as Record<
                        string,
                        string[]
                      >[],
                      `Resources Needing ${selectedTech} Training`
                    )}
                </TabsContent>
                <TabsContent value="trainer" selected={tab === "trainer"}>
                  {selectedTech &&
                    trainerData[selectedTech]?.length > 0 &&
                    renderTable(
                      trainerData[selectedTech] as unknown as Record<
                        string,
                        string[]
                      >[],
                      `Trainers for ${selectedTech}`
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
