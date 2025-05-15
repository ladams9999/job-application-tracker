
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
}

const FormActions: FC<FormActionsProps> = ({ isSubmitting, isEditMode }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        type="button"
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting 
          ? (isEditMode ? "Updating..." : "Submitting...") 
          : (isEditMode ? "Update Application" : "Save Application")
        }
      </Button>
    </div>
  );
};

export default FormActions;
