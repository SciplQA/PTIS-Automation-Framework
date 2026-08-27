/**
 * Interface representing a simple form validation scenario
 */
export interface FormScenario {
  description: string;
  isStepValid: boolean;
  inputs: {
    [fieldName: string]: string | number | boolean;
  };
  expectedErrorMessage?: string;
  expectedSuccessMessage?: string;
}

/**
 * Interface representing Property Tax Module scenario data
 */
export interface PropertyTaxTestData {
  rateSectionMaster: FormScenario[];
  taxZone: FormScenario[];
  searchProperty: {
    description: string;
    searchCriteria: {
      propertyNo?: string;
      ownerName?: string;
      wardNo?: string;
    };
    expectedResultsCount: number;
  }[];
}
