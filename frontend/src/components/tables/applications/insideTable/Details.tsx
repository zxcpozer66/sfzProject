import { Button, Table, TableBody, TableCell, TableRow } from "@mui/material";
import type { FC } from "react";
import type { Detail } from "../../../../interfaces/componentTypes/details";
import type { DetailTableProps } from "../../../../interfaces/otherTypes/detailTableProps";
import {
  detailFields,
  labelMap,
  mapDetailToRequest,
} from "../../../../utils/detailMapping";
import { useRequestForm } from "../../../RequestFormContext";
import { EditableCell } from "./cell/editCell";
import { editApplication } from "../../../../api";

export const DetailTable: FC<DetailTableProps> = ({
  reactionOptions,
  notationOptions,
}) => {
  const { formData, editMode, setFormData } = useRequestForm();

  const detailData: Detail = {
    startTime: formData.start_time
      ? new Date(formData.start_time).toISOString()
      : undefined,
    endTime: formData.end_time
      ? new Date(formData.end_time).toISOString()
      : undefined,
    descriptionProblem: formData.description_problem || "",
    descriptionTask: formData.description_task || "",
    answer: formData.answer || "",
    typeReaction: formData.reaction_type?.title || "",
    order_application: formData.order_application || "",
    notation: formData.notation?.title || "",
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | Date
  ) => {
    console.log(value);
    setFormData((prev) => ({
      ...prev,
      [field]: value instanceof Date ? value.toISOString() : value,
    }));
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return null;
    return new Date(time).toLocaleString();
  };

  const handleTimeButtonClick = async (field: "start_time" | "end_time") => {
    const currentTime = new Date().toISOString();

    try {
      setFormData((prev) => ({
        ...prev,
        [field]: currentTime,
      }));

      await editApplication(formData.id, { [field]: currentTime });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };
  return (
    <Table size="medium" aria-label="details">
      <TableBody>
        {detailFields.map((key) => (
          <TableRow key={key}>
            <TableCell sx={{ width: 200 }}>{labelMap[key]}</TableCell>
            <TableCell>
              {key === "startTime" ? (
                formatTime(detailData.startTime) || (
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    disabled={!editMode}
                    onClick={() => handleTimeButtonClick("start_time")}
                  >
                    Начать работу
                  </Button>
                )
              ) : key === "endTime" ? (
                formatTime(detailData.endTime) || (
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    disabled={!editMode || !detailData.startTime}
                    onClick={() => handleTimeButtonClick("end_time")}
                  >
                    Закончить работу
                  </Button>
                )
              ) : (
                <EditableCell
                  keyName={key}
                  value={detailData[key]}
                  editMode={editMode}
                  reactionOptions={reactionOptions}
                  notationOptions={notationOptions}
                  onChange={(newValue) =>
                    handleInputChange(mapDetailToRequest[key], newValue)
                  }
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
