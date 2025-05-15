
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ApplicationsHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
      <Link to="/add">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </Link>
    </div>
  );
};

export default ApplicationsHeader;
