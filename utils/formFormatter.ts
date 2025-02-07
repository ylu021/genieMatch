import { BioFormType } from "@/types/bioForm";
import { PreferenceForm } from "@/types/preferenceForm";

const stringify = (formData: Partial<PreferenceForm>) =>
  JSON.stringify(formData, (_key, value) =>
    value instanceof Set ? [...value] : value
  );

// Your custom parsing function (which converts arrays back to Sets)
const parse = (stringObject: string) =>
  JSON.parse(stringObject, (_key, value) =>
    Array.isArray(value) ? new Set(value) : value
  );

const validateBioForm = (form: BioFormType) => {
  return Object.values(form).filter((v) => !v.trim()).length === 0; // filter only the empty ones
};

export default {
  stringify,
  parse,
  validateBioForm,
};
