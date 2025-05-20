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

// Custom styles to match the design in the image
const useStyles = makeStyles({
  container: {
    padding: '0',
    '& .MuiFormControl-root': {
      margin: '0.75rem 0',
    },
    '& .MuiInputBase-root': {
      backgroundColor: 'white',
      borderRadius: '0.375rem',
    },
    '& .MuiOutlinedInput-input': {
      padding: '0.75rem 1rem',
      color: 'black',
    },
    '& .MuiInputLabel-root': {
      display: 'none', // Hide labels as they're not in the design
    },
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
      marginTop: '0.25rem',
    },
    '& .MuiOutlinedInput-root': {
      borderColor: '#d1d5db',
      '& fieldset': {
        borderColor: '#d1d5db',
      },
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6B7280',
    },
    '& .MuiCheckbox-root': {
      padding: '0.5rem',
      marginRight: '0.5rem',
      color: '#000',
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#000',
    },
    '& .MuiFormControlLabel-root': {
      marginLeft: '0',
      marginRight: '0',
      marginBottom: '0.25rem',
    },
    '& .MuiFormGroup-root': {
      marginTop: '0.5rem',
    },
    '& .MuiFormControl-fullWidth': {
      width: '100%',
    },
    // Placeholder styling
    '& .MuiOutlinedInput-root input::placeholder': {
      color: '#9ca3af',
      opacity: 1,
    },
    // Select styling
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      height: '1.5rem',
    },
    // Remove default MUI styling for inputs
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d1d5db',
    },
    // Textarea
    '& .MuiOutlinedInput-multiline': {
      padding: '0',
    },
    '& .MuiOutlinedInput-multiline textarea': {
      padding: '0.75rem 1rem',
    },
    // Group title styling
    '& .group-title': {
      fontSize: '1rem',
      fontWeight: 'bold',
      margin: '1.5rem 0 0.5rem',
      color: 'black',
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
  const [isTouched, setIsTouched] = useState(false);
  const [validationMode, setValidationMode] = useState<'ValidateAndShow' | 'ValidateAndHide'>('ValidateAndHide');
  const classes = useStyles();

  // Client-side only execution to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle change in form data
  const handleChange = ({ data: newData }: { data: Record<string, unknown> }) => {
    setData(newData);
    
    // If form has been touched before, show validation as user types
    if (isTouched) {
      setValidationMode('ValidateAndShow');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set the form as touched on submit
    setIsTouched(true);
    setValidationMode('ValidateAndShow');

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

  // Only show validation errors if the form has been touched
  const displayErrors = validationMode === 'ValidateAndShow' && errors.length > 0;

  return (
    <div className="max-w-md mx-auto">
      {displayErrors && (
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
            onChange={handleChange}
            validationMode={validationMode}
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