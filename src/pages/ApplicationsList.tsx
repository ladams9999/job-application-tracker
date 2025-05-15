
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JobApplication, ApplicationFilter, ApplicationStatus } from "@/types";
import { getAllApplications, deleteApplication, filterApplications } from "@/services/applicationService";
import { Plus, Search, ArrowUp, ArrowDown, Trash, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ApplicationsList = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState<ApplicationFilter>({
    search: "",
    status: "all",
    sortBy: "dateApplied",
    sortDirection: "desc",
  });

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    const filtered = filterApplications(applications, filter);
    setFilteredApplications(filtered);
  }, [applications, filter]);

  const loadApplications = () => {
    const data = getAllApplications();
    setApplications(data);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFilter({ ...filter, status: value as ApplicationStatus | "all" });
  };

  const handleSortChange = (field: "dateApplied" | "company" | "jobTitle" | "status") => {
    if (filter.sortBy === field) {
      setFilter({
        ...filter,
        sortDirection: filter.sortDirection === "asc" ? "desc" : "asc",
      });
    } else {
      setFilter({
        ...filter,
        sortBy: field,
        sortDirection: "asc",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      loadApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderSortIcon = (field: "dateApplied" | "company" | "jobTitle" | "status") => {
    if (filter.sortBy !== field) return null;
    
    return filter.sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 inline ml-1" />
    );
  };

  const getStatusColor = (status: ApplicationStatus) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      interview: "bg-yellow-100 text-yellow-800",
      offer: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      withdrawn: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <Link to="/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-10"
            value={filter.search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={filter.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSortChange("company")}>
                Company {renderSortIcon("company")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSortChange("jobTitle")}>
                Job Title {renderSortIcon("jobTitle")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSortChange("dateApplied")}>
                Date Applied {renderSortIcon("dateApplied")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSortChange("status")}>
                Status {renderSortIcon("status")}
              </TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    <Link to={`/edit/${app.id}`} className="text-primary hover:underline">
                      {app.company}
                    </Link>
                  </TableCell>
                  <TableCell>{app.jobTitle}</TableCell>
                  <TableCell>{formatDate(app.dateApplied)}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/edit/${app.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Application</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this application for {app.jobTitle} at {app.company}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(app.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {filter.search || filter.status !== "all" ? (
                    <div className="text-muted-foreground">
                      No applications match your search criteria.
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      <p>No applications yet.</p>
                      <Link to="/add" className="text-primary font-medium hover:underline mt-2 inline-block">
                        Add your first application
                      </Link>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ApplicationsList;
