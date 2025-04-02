import React from "react";
import Image from "next/image";
import { Control } from "react-hook-form";

import "react-phone-number-input/style.css";
import { E164Number } from "libphonenumber-js/core";
import PhoneInput from "react-phone-number-input";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FormFieldType } from "./PatientForm";

// Import DatePicker correctly
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
const DatePicker = ReactDatePicker as unknown as React.FC<
  ReactDatePicker["props"] & React.RefAttributes<ReactDatePicker>
>;
interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

interface DatePickerFieldProps {
  field: any;
  showTimeSelect?: boolean;
  dateFormat?: string;
  placeholderText?: string;
}

// Create a separate DatePickerField component
const DatePickerField: React.FC<DatePickerFieldProps> = ({
  field,
  showTimeSelect = false,
  dateFormat = "MM/dd/yyyy",
  placeholderText = "Select date",
}) => {
  return (
    <div className="flex rounded-md border border-dark-500 bg-dark-400">
      <Image
        src="/assets/icons/calendar.svg"
        height={24}
        width={24}
        alt="calendar"
        className="ml-2 my-auto"
      />
      <FormControl>
        <div className="w-full">
          <DatePicker
            selected={field.value}
            onChange={(date: Date | null) => field.onChange(date)}
            onBlur={field.onBlur}
            showTimeSelect={showTimeSelect}
            timeCaption="Time"
            dateFormat={dateFormat}
            placeholderText={placeholderText}
            className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none p-2"
            wrapperClassName="date-picker w-full"
            name={field.name}
          />
        </div>
      </FormControl>
    </div>
  );
};

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const { fieldType, iconSrc, iconAlt, placeholder } = props;
  switch (fieldType) {
    case FormFieldType.DATE_PICKER:
      return (
        <DatePickerField
          field={field}
          showTimeSelect={props.showTimeSelect ?? false}
          dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
          placeholderText={props.placeholder || "MM/DD/YYYY"}
        />
      );
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              height={20}
              width={20}
              alt={iconAlt || "icon"}
              className="flex rounded-sm m-auto"
            />
          )}

          <FormControl>
            <Input
              type="text"
              {...field}
              placeholder={placeholder}
              disabled={props.disabled}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="DZ"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );
    default:
      return null;
  }
};

export const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
