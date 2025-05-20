'use client';

import { JsonForms } from '@jsonforms/react';
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { CircularProgress } from '@mui/material';

// Custom styles for the renderer
const useStyles = makeStyles({
  container: {
    padding: '1rem',
    '& .MuiFormControl-root': {
      margin: '0.75rem 0',
    },
    '& .MuiInputBase-root': {
      backgroundColor: 'white',
      borderRadius: '0.375rem',
    },
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      color: 'black',
    },
    '& .MuiOutlinedInput-root': {
      borderColor: '#d1d5db',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6B7280',
    },
    '& .MuiCheckbox-root': {
      color: '#000',
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#000',
    },
    '& .MuiButtonBase-root': {
      textTransform: 'none',
    },
    '& .MuiFormLabel-asterisk': {
      color: '#d32f2f',
    },
    '& .MuiFormGroup-root': {
      marginTop: '0.5rem',
    },
    '& .MuiFormControl-fullWidth': {
      width: '100%',
    },
  },
  button: {
    backgroundColor: '#000',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontWeight: 500,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#1f2937',
    },
    '&:disabled': {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
  },
});

interface JsonFormsRendererProps {
  schema: JsonSchema;
  uischema: UISchemaElement;
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  submitButtonLabel?: string;
  isSubmitting?: boolean;
}

export function JsonFormsRenderer({
  schema,
  uischema,
  initialData = {},
  onSubmit,
  submitButtonLabel = 'Submit',
  isSubmitting = false,
}: JsonFormsRendererProps) {
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const classes = useStyles();

  // Client-side only execution to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get required fields from schema
    const requiredFields = schema.required || [];
    const newErrors: string[] = [];

    // Validate required fields
    requiredFields.forEach((field: string) => {
      const fieldValue = data[field];
      if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
        const fieldSchema = schema.properties?.[field] as JsonSchema;
        newErrors.push(`${fieldSchema?.title || field} is required`);
      }
    });

    // Email validation
    const email = data.email as string;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push('Please enter a valid email address');
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      onSubmit(data);
    }
  };

  if (!mounted) {
    return <div className="text-center py-4">Initializing form...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className={classes.container}>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data }) => setData(data as Record<string, unknown>)}
          />
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" className="mr-2" />
                Submitting...
              </>
            ) : (
              submitButtonLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 