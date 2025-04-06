"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { Doctors, GenderOptions, PatientFormDefaultValues } from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { FileUploader } from "../FileUploader";
import SubmitButton from "../SubmitButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneFromURL, setPhoneFromURL] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      phone: "",
    },
  });

  // Effect to get phone number from URL and set it in the form
  useEffect(() => {
    // Get phone from URL parameters
    const params = new URLSearchParams(window.location.search);
    const phone = params.get("phone");

    if (phone) {
      setPhoneFromURL(phone);
      form.setValue("phone", phone);

      toast({
        title: "Welcome to Pulse!",
        description: "Please complete your registration to continue.",
      });
    }
  }, [form]);

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    // Handle file upload if present
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        primaryPhysician: values.primaryPhysician,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        toast({
          title: "Registration Successful",
          description: "You can now proceed to login.",
        });

        // Pass the phone number to the login page
        router.push(
          `/dashboard/patients/${user.$id}/login?phone=${encodeURIComponent(values.phone)}`
        );
      }
    } catch (error) {
      console.error("Error registering patient:", error);
      toast({
        title: "Registration Failed",
        description:
          "There was an error registering your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-gray-500">
            Please wait while we process your registration...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 pb-6 pt-8 text-center dark:border-gray-700">
          <div className="flex flex-col items-center justify-center">
            <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300">
              Patient Registration
            </span>
            <h1 className="font-serif text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
              Welcome to Pulse 👋
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
              Please complete your profile to continue. Your information helps
              us provide better care.
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8 pt-6 md:px-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 space-y-8"
            >
              <div className="rounded-lg ">
                <h2 className="mb-4 text-xl font-semibold ">
                  Personal Information
                </h2>

                <div className="flex flex-col gap-6 md:flex-row ">
                  <div className="w-full md:w-1/2">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="name"
                      label="Full Name"
                      placeholder="John Doe"
                      iconSrc="/assets/icons/user.svg"
                      iconAlt="user"
                    />
                  </div>

                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="w-full md:w-1/2">
                      <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="Phone Number"
                        placeholder="+213555555555"
                        disabled={!!phoneFromURL} // Disable if we have a phone from URL
                      />
                      {phoneFromURL && (
                        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                          ✓ Phone number verified
                        </p>
                      )}
                    </div>

                    <div className="w-full md:w-1/2">
                      <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="birthDate"
                        label="Date of Birth"
                      />
                    </div>
                  </div>

                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="gender"
                    label="Gender"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <RadioGroup
                          className="flex h-11 gap-6 xl:justify-between"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          {GenderOptions.map((option, i) => (
                            <div key={option + i} className="radio-group">
                              <RadioGroupItem value={option} id={option} />
                              <Label
                                htmlFor={option}
                                className="cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Micro activity zone 13, Algiers, Algeria"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                  Medical Information
                </h2>

                <div className="space-y-6">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Primary Care Physician"
                    placeholder="Select a physician"
                  >
                    {Doctors.map((doctor, i) => (
                      <SelectItem key={doctor.name + i} value={doctor.name}>
                        <div className="flex cursor-pointer items-center gap-2">
                          <Image
                            src={doctor.image}
                            width={32}
                            height={32}
                            alt="doctor"
                            className="rounded-full border border-dark-500"
                          />
                          <p>{doctor.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </CustomFormField>

                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Identification Document"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <FileUploader
                          files={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                  Consent and Privacy
                </h2>

                <div className="space-y-4">
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to receive treatment for my health condition."
                  />

                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to the use and disclosure of my health information for treatment purposes."
                  />

                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I acknowledge that I have reviewed and agree to the privacy policy."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <SubmitButton
                  isLoading={isLoading}
                  className="bg-emerald-600 px-8 py-3 text-lg transition-all duration-300 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  Complete Registration
                </SubmitButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
