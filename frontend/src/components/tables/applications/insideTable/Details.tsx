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

export const DetailTable: FC<DetailTableProps> = ({
  reactionOptions,
  notationOptions,
}) => {
  const { formData, editMode, setFormData } = useRequestForm();

  const detailData: Detail = {
    startTime: formData.start_time || undefined,
    endTime: formData.end_time || undefined,
    descriptionProblem: formData.description_problem || "",
    descriptionTask: formData.description_task || "",
    answer: formData.answer || "",
    typeReaction: formData.reaction_type?.title || "",
    order_apllication: formData.order_apllication || "",
    notation: formData.notation?.title || "",
  };
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Table size="medium" aria-label="details">
     <TableBody>
  {detailFields.map((key) => (
    <TableRow key={key}>
      <TableCell sx={{ width: 200 }}>{labelMap[key]}</TableCell>
      <TableCell>
        {key === "startTime" && (
          <>
            {detailData.startTime ? (
              detailData.startTime.toLocaleString()
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  handleInputChange("start_time", new Date().toISOString())
                }
              >
                Начать работу
              </Button>
            )}
          </>
        )}

        {key === "endTime" && (
          <>
            {detailData.endTime ? (
              detailData.endTime.toLocaleString()
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  handleInputChange("end_time", new Date().toISOString())
                }
              >
                Закончить работу
              </Button>
            )}
          </>
        )}

        {!["startTime", "endTime"].includes(key) && (
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
