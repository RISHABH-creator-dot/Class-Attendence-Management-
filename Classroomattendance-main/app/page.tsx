"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Settings,
  LogOut,
  User,
  Download,
} from "lucide-react"

interface Student {
  id: string
  name: string
  rollNumber: string
}

interface AttendanceRecord {
  studentId: string
  date: string
  status: "present" | "absent"
  classId: string
}

interface Class {
  id: string
  name: string
  subject: string
  students: Student[]
}

const DUMMY_TEACHERS = [
  { username: "teacher1", password: "123456", name: "Dr. Ahmad Hassan" },
  { username: "teacher2", password: "123456", name: "Prof. Sarah Khan" },
  { username: "admin", password: "admin123", name: "Admin User" },
]

export default function AttendanceSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentTeacher, setCurrentTeacher] = useState<string>("")
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split("T")[0])

  const [newClassName, setNewClassName] = useState("")
  const [newClassSubject, setNewClassSubject] = useState("")
  const [newStudentName, setNewStudentName] = useState("")
  const [newStudentRoll, setNewStudentRoll] = useState("")

  const handleLogin = () => {
    console.log("[v0] Login attempt:", { username: loginUsername, password: loginPassword })
    console.log("[v0] Available teachers:", DUMMY_TEACHERS)

    const teacher = DUMMY_TEACHERS.find((t) => t.username === loginUsername && t.password === loginPassword)
    console.log("[v0] Found teacher:", teacher)

    if (teacher) {
      setIsLoggedIn(true)
      setCurrentTeacher(teacher.name)
      setLoginError("")
      localStorage.setItem("attendifyLogin", JSON.stringify({ teacherName: teacher.name }))
      console.log("[v0] Login successful")
    } else {
      setLoginError("Invalid username or password")
      console.log("[v0] Login failed - no matching teacher found")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentTeacher("")
    setLoginUsername("")
    setLoginPassword("")
    localStorage.removeItem("attendifyLogin")
  }

  useEffect(() => {
    const savedLogin = localStorage.getItem("attendifyLogin")
    if (savedLogin) {
      const loginData = JSON.parse(savedLogin)
      setIsLoggedIn(true)
      setCurrentTeacher(loginData.teacherName)
    }
  }, [])

  useEffect(() => {
    const sampleClasses: Class[] = [
      {
        id: "cs101",
        name: "B.Tech Computer Science",
        subject: "Introduction to Programming",
        students: [
          { id: "1", name: "Ahmed Ali", rollNumber: "CS-2024-001" },
          { id: "2", name: "Fatima Khan", rollNumber: "CS-2024-002" },
          { id: "3", name: "Hassan Ahmed", rollNumber: "CS-2024-003" },
          { id: "4", name: "Ayesha Malik", rollNumber: "CS-2024-004" },
          { id: "5", name: "Omar Sheikh", rollNumber: "CS-2024-005" },
        ],
      },
      {
        id: "law201",
        name: "LLB Law",
        subject: "Constitutional Law",
        students: [
          { id: "6", name: "Sara Hussain", rollNumber: "LAW-2024-001" },
          { id: "7", name: "Ali Raza", rollNumber: "LAW-2024-002" },
          { id: "8", name: "Zainab Tariq", rollNumber: "LAW-2024-003" },
          { id: "9", name: "Bilal Ahmad", rollNumber: "LAW-2024-004" },
        ],
      },
    ]

    const savedClasses = localStorage.getItem("attendanceClasses")
    const savedRecords = localStorage.getItem("attendanceRecords")

    if (savedClasses) {
      setClasses(JSON.parse(savedClasses))
    } else {
      setClasses(sampleClasses)
      localStorage.setItem("attendanceClasses", JSON.stringify(sampleClasses))
    }

    if (savedRecords) {
      setAttendanceRecords(JSON.parse(savedRecords))
    }
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-hover shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent attendify-title">
                Attendify
              </CardTitle>
              <CardDescription className="text-base mt-2">Professional Academic Management Portal</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm text-center font-medium">{loginError}</p>
              </div>
            )}

            <Button
              onClick={handleLogin}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={!loginUsername || !loginPassword}
            >
              <User className="w-4 h-4 mr-2" />
              Sign In to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const createNewClass = () => {
    if (!newClassName.trim() || !newClassSubject.trim()) return

    const newClass: Class = {
      id: Date.now().toString(),
      name: newClassName.trim(),
      subject: newClassSubject.trim(),
      students: [],
    }

    const updatedClasses = [...classes, newClass]
    setClasses(updatedClasses)
    localStorage.setItem("attendanceClasses", JSON.stringify(updatedClasses))

    setNewClassName("")
    setNewClassSubject("")
  }

  const deleteClass = (classId: string) => {
    const updatedClasses = classes.filter((c) => c.id !== classId)
    setClasses(updatedClasses)
    localStorage.setItem("attendanceClasses", JSON.stringify(updatedClasses))

    // Clear selection if deleted class was selected
    if (selectedClass === classId) {
      setSelectedClass("")
    }

    // Remove attendance records for deleted class
    const updatedRecords = attendanceRecords.filter((r) => r.classId !== classId)
    setAttendanceRecords(updatedRecords)
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords))
  }

  const addStudentToClass = () => {
    if (!selectedClass || !newStudentName.trim() || !newStudentRoll.trim()) return

    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      rollNumber: newStudentRoll.trim(),
    }

    const updatedClasses = classes.map((cls) => {
      if (cls.id === selectedClass) {
        return {
          ...cls,
          students: [...cls.students, newStudent],
        }
      }
      return cls
    })

    setClasses(updatedClasses)
    localStorage.setItem("attendanceClasses", JSON.stringify(updatedClasses))

    setNewStudentName("")
    setNewStudentRoll("")
  }

  const deleteStudent = (studentId: string) => {
    const updatedClasses = classes.map((cls) => {
      if (cls.id === selectedClass) {
        return {
          ...cls,
          students: cls.students.filter((s) => s.id !== studentId),
        }
      }
      return cls
    })

    setClasses(updatedClasses)
    localStorage.setItem("attendanceClasses", JSON.stringify(updatedClasses))

    // Remove attendance records for deleted student
    const updatedRecords = attendanceRecords.filter((r) => r.studentId !== studentId)
    setAttendanceRecords(updatedRecords)
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords))
  }

  const markAttendance = (studentId: string, status: "present" | "absent") => {
    console.log("[v0] markAttendance called:", { studentId, status, selectedClass, currentDate })

    if (!selectedClass) {
      console.log("[v0] Error: No class selected for attendance")
      alert("Please select a class first!")
      return
    }

    const newRecord: AttendanceRecord = {
      studentId,
      date: currentDate,
      status,
      classId: selectedClass,
    }

    console.log("[v0] Creating new attendance record:", newRecord)

    const updatedRecords = attendanceRecords.filter(
      (record) => !(record.studentId === studentId && record.date === currentDate && record.classId === selectedClass),
    )
    updatedRecords.push(newRecord)

    console.log("[v0] Updated attendance records:", updatedRecords)

    setAttendanceRecords(updatedRecords)
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords))

    console.log("[v0] Attendance marked successfully")
  }

  const getAttendanceStatus = (studentId: string, date: string = currentDate) => {
    const record = attendanceRecords.find(
      (r) => r.studentId === studentId && r.date === date && r.classId === selectedClass,
    )
    return record?.status
  }

  const getAttendanceStats = (classId: string) => {
    const classRecords = attendanceRecords.filter((r) => r.classId === classId)
    const totalRecords = classRecords.length
    const presentCount = classRecords.filter((r) => r.status === "present").length
    const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0

    return {
      totalRecords,
      presentCount,
      absentCount: totalRecords - presentCount,
      attendanceRate: Math.round(attendanceRate),
    }
  }

  const selectedClassData = classes.find((c) => c.id === selectedClass)

  const exportToExcel = (classId?: string) => {
    const classesToExport = classId ? classes.filter((c) => c.id === classId) : classes

    if (classesToExport.length === 0) {
      alert("No classes to export!")
      return
    }

    // Create CSV content
    let csvContent = "Class Name,Subject,Student Name,Roll Number,Date,Status\n"

    classesToExport.forEach((cls) => {
      cls.students.forEach((student) => {
        const studentRecords = attendanceRecords.filter((r) => r.studentId === student.id && r.classId === cls.id)

        if (studentRecords.length > 0) {
          studentRecords.forEach((record) => {
            csvContent += `"${cls.name}","${cls.subject}","${student.name}","${student.rollNumber}","${record.date}","${record.status}"\n`
          })
        } else {
          // Include students with no attendance records
          csvContent += `"${cls.name}","${cls.subject}","${student.name}","${student.rollNumber}","No Records","N/A"\n`
        }
      })
    })

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)

    const fileName = classId
      ? `${classesToExport[0].name.replace(/[^a-z0-9]/gi, "_")}_attendance.csv`
      : `all_classes_attendance.csv`

    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportDateRangeExcel = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!")
      return
    }

    let csvContent = "Class Name,Subject,Student Name,Roll Number,Date,Status\n"

    classes.forEach((cls) => {
      cls.students.forEach((student) => {
        const studentRecords = attendanceRecords.filter(
          (r) => r.studentId === student.id && r.classId === cls.id && r.date >= startDate && r.date <= endDate,
        )

        studentRecords.forEach((record) => {
          csvContent += `"${cls.name}","${cls.subject}","${student.name}","${student.rollNumber}","${record.date}","${record.status}"\n`
        })
      })
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance_${startDate}_to_${endDate}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-background">
      <header
        className="text-white shadow-lg"
        style={{
          background: "linear-gradient(to right, #000000, #374151)",
          backgroundColor: "#000000",
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/fs-university-logo.png" alt="FS University Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-3xl font-bold attendify-title" style={{ color: "#ffffff" }}>
                  Attendify
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>Professional Academic Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                  Welcome back,
                </p>
                <p className="font-semibold" style={{ color: "#ffffff" }}>
                  {currentTeacher}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="border-white/30 hover:bg-gray-700"
                style={{
                  backgroundColor: "#374151",
                  color: "#ffffff",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: "#374151",
                  color: "#ffffff",
                }}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="attendance" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] h-12 bg-muted/50">
            <TabsTrigger
              value="attendance"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-4 h-4" />
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="w-4 h-4" />
              Manage Classes
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4" />
              View Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-8">
            <Card className="card-hover shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Create New Class
                </CardTitle>
                <CardDescription className="text-base">
                  Add a new class like B.Tech CS, LLB Law, MBA, etc.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="className" className="text-sm font-semibold">
                      Class Name
                    </Label>
                    <Input
                      id="className"
                      placeholder="e.g., B.Tech Computer Science, LLB Law, MBA"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classSubject" className="text-sm font-semibold">
                      Subject
                    </Label>
                    <Input
                      id="classSubject"
                      placeholder="e.g., Data Structures, Constitutional Law"
                      value={newClassSubject}
                      onChange={(e) => setNewClassSubject(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
                <Button
                  onClick={createNewClass}
                  className="mt-6 h-11 bg-primary hover:bg-primary/90"
                  disabled={!newClassName.trim() || !newClassSubject.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Class
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover shadow-md">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                    <img src="/fs-university-logo.png" alt="FS University Logo" className="w-6 h-6 object-contain" />
                  </div>
                  Existing Classes
                </CardTitle>
                <CardDescription className="text-base">Manage your classes and students</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="border-2 border-border rounded-xl p-6 bg-gradient-to-r from-card to-muted/30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-xl text-foreground">{cls.name}</h3>
                          <p className="text-muted-foreground font-medium">{cls.subject}</p>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            <Users className="w-3 h-3 mr-1" />
                            {cls.students.length} Students
                          </Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteClass(cls.id)}
                          className="hover:scale-105 transition-transform"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Class
                        </Button>
                      </div>

                      {/* Student Management for this class */}
                      {selectedClass === cls.id && (
                        <div className="mt-4 space-y-3 border-t pt-4">
                          <h4 className="font-medium">Add New Student</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              placeholder="Student Name"
                              value={newStudentName}
                              onChange={(e) => setNewStudentName(e.target.value)}
                            />
                            <Input
                              placeholder="Roll Number"
                              value={newStudentRoll}
                              onChange={(e) => setNewStudentRoll(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={addStudentToClass}
                            size="sm"
                            disabled={!newStudentName.trim() || !newStudentRoll.trim()}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Student
                          </Button>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedClass(selectedClass === cls.id ? "" : cls.id)}
                        className="mt-4 border-primary/20 hover:bg-primary/5"
                      >
                        {selectedClass === cls.id ? "Hide Students" : "Manage Students"}
                      </Button>

                      {/* Student List */}
                      {selectedClass === cls.id && cls.students.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-medium">Students in this class:</h4>
                          {cls.students.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                              </div>
                              <Button variant="destructive" size="sm" onClick={() => deleteStudent(student.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-8">
            {!selectedClass && (
              <Card className="card-hover shadow-md">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    Select Class for Attendance
                  </CardTitle>
                  <CardDescription className="text-base">Choose a class to mark attendance for today</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold">Available Classes</Label>
                    <Select
                      onValueChange={(classId) => {
                        console.log("[v0] Selected class for attendance:", classId)
                        setSelectedClass(classId)
                      }}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a class to mark attendance..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{cls.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {cls.subject} • {cls.students.length} students
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedClass && (
              <Card className="card-hover shadow-md">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <img
                          src="/fs-university-logo.png"
                          alt="FS University Logo"
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      {selectedClassData && (
                        <>
                          {selectedClassData.name} - Student Attendance
                          <Badge
                            variant="outline"
                            className="text-base px-3 py-1 bg-primary/10 text-primary border-primary/20"
                          >
                            {selectedClassData.students.length} Students
                          </Badge>
                        </>
                      )}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("[v0] Changing class selection")
                        setSelectedClass("")
                      }}
                      className="border-primary/20 hover:bg-primary/5"
                    >
                      Change Class
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {selectedClassData && `Mark attendance for ${new Date(currentDate).toLocaleDateString()}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {selectedClassData && selectedClassData.students.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                        <Users className="w-10 h-10 opacity-50" />
                      </div>
                      <p className="text-lg font-medium">No students in this class yet.</p>
                      <p className="text-sm mt-1">Go to "Manage Classes" tab to add students.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedClassData &&
                        selectedClassData.students.map((student) => {
                          const status = getAttendanceStatus(student.id)
                          return (
                            <div
                              key={student.id}
                              className="flex items-center justify-between p-5 border-2 border-border rounded-xl bg-gradient-to-r from-card to-muted/20 hover:shadow-md transition-all"
                            >
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-foreground">{student.name}</h3>
                                <p className="text-muted-foreground font-medium">{student.rollNumber}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                {status && (
                                  <Badge
                                    variant={status === "present" ? "default" : "destructive"}
                                    className={`mr-2 px-3 py-1 ${status === "present" ? "bg-primary text-primary-foreground" : ""}`}
                                  >
                                    {status === "present" ? (
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                    ) : (
                                      <XCircle className="w-3 h-3 mr-1" />
                                    )}
                                    {status === "present" ? "Present" : "Absent"}
                                  </Badge>
                                )}
                                <Button
                                  size="sm"
                                  variant={status === "present" ? "default" : "outline"}
                                  onClick={() => {
                                    console.log("[v0] Marking student present:", student.id, student.name)
                                    markAttendance(student.id, "present")
                                  }}
                                  className="attendance-button bg-primary hover:bg-primary/90 text-primary-foreground border-primary h-10 px-4"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Present
                                </Button>
                                <Button
                                  size="sm"
                                  variant={status === "absent" ? "destructive" : "outline"}
                                  onClick={() => {
                                    console.log("[v0] Marking student absent:", student.id, student.name)
                                    markAttendance(student.id, "absent")
                                  }}
                                  className="attendance-button h-10 px-4"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Absent
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-8">
            <Card className="card-hover shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Export Attendance Data
                </CardTitle>
                <CardDescription className="text-base">Download attendance records as Excel/CSV files</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Export All Classes */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Export All Classes</h3>
                    <p className="text-sm text-muted-foreground">Download complete attendance data for all classes</p>
                    <Button onClick={() => exportToExcel()} className="w-full h-11 bg-primary hover:bg-primary/90">
                      <Download className="w-4 h-4 mr-2" />
                      Download All Classes Data
                    </Button>
                  </div>

                  {/* Export Specific Class */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Export Specific Class</h3>
                    <p className="text-sm text-muted-foreground">Download attendance data for a selected class</p>
                    <Select onValueChange={(classId) => exportToExcel(classId)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select class to export..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{cls.name}</span>
                              <span className="text-sm text-muted-foreground">{cls.subject}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date Range Export */}
                <div className="mt-8 p-6 border-2 border-dashed border-border rounded-lg bg-muted/20">
                  <h3 className="font-semibold text-lg mb-4">Export by Date Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Start Date</Label>
                      <input
                        type="date"
                        id="startDate"
                        className="h-11 w-full px-3 py-2 border-2 border-border rounded-lg bg-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">End Date</Label>
                      <input
                        type="date"
                        id="endDate"
                        className="h-11 w-full px-3 py-2 border-2 border-border rounded-lg bg-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const startDate = (document.getElementById("startDate") as HTMLInputElement)?.value
                        const endDate = (document.getElementById("endDate") as HTMLInputElement)?.value
                        exportDateRangeExcel(startDate, endDate)
                      }}
                      className="h-11 bg-accent hover:bg-accent/90"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Export Range
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {classes.map((cls) => {
                const stats = getAttendanceStats(cls.id)
                return (
                  <Card key={cls.id} className="stats-card card-hover shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-muted-foreground truncate">{cls.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-primary">{stats.attendanceRate}%</span>
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Present:</span>
                            <span className="font-semibold text-primary">{stats.presentCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Absent:</span>
                            <span className="font-semibold text-destructive">{stats.absentCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-semibold">{stats.totalRecords}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportToExcel(cls.id)}
                          className="w-full mt-3 border-primary/20 hover:bg-primary/5"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="border-t-2 bg-gradient-to-r from-card to-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src="/fs-university-logo.png" alt="FS University Logo" className="w-6 h-6 object-contain" />
              <span className="font-bold text-primary attendify-title text-sm">Attendify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Developed by <span className="font-semibold text-primary">Rishabh Yadav</span> &{" "}
              <span className="font-semibold text-primary">Aditya Agrawal</span> &{" "}
              <span className="font-semibold text-primary">Dakshraj</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
