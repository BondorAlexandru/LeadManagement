import { JsonSchema } from '@jsonforms/core';

export const leadFormSchema: JsonSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
      title: 'First Name',
    },
    lastName: {
      type: 'string',
      minLength: 1,
      title: 'Last Name',
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
    country: {
      type: 'string',
      title: 'Country of Citizenship',
      enum: [
        'united_states',
        'mexico',
        'india',
        'china',
        'canada',
        'russia',
        'brazil',
        'south_korea',
        'france',
        'other',
      ],
    },
    linkedInProfile: {
      type: 'string',
      minLength: 1,
      title: 'LinkedIn / Personal Website URL',
    },
    visasOfInterest: {
      type: 'array',
      minItems: 1,
      title: 'Visa Categories of Interest',
      items: {
        type: 'string',
        enum: ['O-1', 'EB-1A', 'EB-2 NIW', "I don't know"],
      },
    },
    additionalInformation: {
      type: 'string',
      title: 'How can we help you?',
    },
  },
  required: ['firstName', 'lastName', 'email', 'linkedInProfile', 'visasOfInterest'],
};

export const leadFormUISchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Personal Information',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/firstName',
        },
        {
          type: 'Control',
          scope: '#/properties/lastName',
        },
        {
          type: 'Control',
          scope: '#/properties/email',
        },
        {
          type: 'Control',
          scope: '#/properties/country',
          options: {
            format: 'select',
            placeholder: 'Select your country',
          },
        },
        {
          type: 'Control',
          scope: '#/properties/linkedInProfile',
        },
      ],
    },
    {
      type: 'Group',
      label: 'Visa Information',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/visasOfInterest',
          options: {
            format: 'checkbox',
          },
        },
      ],
    },
    {
      type: 'Group',
      label: 'Additional Information',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/additionalInformation',
          options: {
            multi: true,
            rows: 5,
            placeholder: 'What is your current status and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations?'
          },
        },
      ],
    },
  ],
};

// Country display names for the dropdown options
export const countryLabels: Record<string, string> = {
  united_states: 'United States',
  mexico: 'Mexico',
  india: 'India',
  china: 'China',
  canada: 'Canada',
  russia: 'Russia',
  brazil: 'Brazil',
  south_korea: 'South Korea',
  france: 'France',
  other: 'Other',
}; 