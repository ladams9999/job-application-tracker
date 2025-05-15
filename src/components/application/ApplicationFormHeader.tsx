
import { FC } from "react";

interface ApplicationFormHeaderProps {
  isEditMode: boolean;
}

const ApplicationFormHeader: FC<ApplicationFormHeaderProps> = ({ isEditMode }) => (
  <h1 className="text-3xl font-bold tracking-tight mb-6">
    {isEditMode ? "Edit Application" : "Add New Application"}
  </h1>
);

export default ApplicationFormHeader;
