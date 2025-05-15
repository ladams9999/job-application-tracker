
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JobApplication, ApplicationFilter, ApplicationStatus } from "@/types";
import { ArrowUp, ArrowDown, Trash, Edit } from "lucide-react";
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

interface ApplicationsTableProps {
  applications: JobApplication[];
  filter: ApplicationFilter;
  onSortChange: (field: "dateApplied" | "company" | "jobTitle" | "status") => void;
  onDelete: (id: string) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ 
  applications, 
  filter, 
  onSortChange, 
  onDelete 
}) => {
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
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] cursor-pointer" onClick={() => onSortChange("company")}>
              Company {renderSortIcon("company")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSortChange("jobTitle")}>
              Job Title {renderSortIcon("jobTitle")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSortChange("dateApplied")}>
              Date Applied {renderSortIcon("dateApplied")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSortChange("status")}>
              Status {renderSortIcon("status")}
            </TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length > 0 ? (
            applications.map((app) => (
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
                          <AlertDialogAction onClick={() => onDelete(app.id)}>Delete</AlertDialogAction>
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
  );
};

export default ApplicationsTable;
