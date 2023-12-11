import styled from "styled-components";
import { Container } from "../../../../components/shared";
import { Typography, Button, Input, TextareaAutosize } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useState } from "react";
import { BaseProps } from "../../../types";
import { FormView } from "../../../../components/Forms/styles";
import { ContactSection, ContactSectionContent, DualInput, InputBoxContainer, InputBox, TextAreaBox, ButtonText } from "./styles";
import Break from "../../../../components/Break/Break";


const ErrorMsg = styled(ErrorMessage)({
  color: "red",
  fontSize: "10pt",
});

const Contact = ({ id }: BaseProps) => {
  const [submitting, setSubmitting] = useState(false);
  const initialValues = {
    name: "",
    email: "",
    message: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
  });

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setSubmitting(true);
    await sendContactUsForm(values.message, values.name, values.email);
    resetForm();
    setSubmitting(false);
  };

  const sendContactUsForm = async (
    body: string,
    name: string,
    email: string
  ): Promise<void> => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/contact-us/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: body,
            name: name,
            email: email,
          }),
        }
      );
      toast.success(await res.text(), {
        position: "bottom-center",
      });
    } catch (err: any) {
      console.error("ERROR: ", err);
      toast.error(await err.text(), {
        position: "bottom-center",
      });
    }
  };
  return (
    <ContactSection id={id}>
      <ContactSectionContent>
        <div>
          <Typography variant="h1" textAlign="center" fontWeight="bold">
            What do you think?
          </Typography>
          <Typography variant="h4" textAlign="center" style={{ maxWidth: '800px' }}>
            At this moment we are still in development, but we still want to hear from you and want to know what you think.
          </Typography>
        </div>
        <Break style={{ maxWidth: '700px', width: '80%' }} />
        <FormView style={{ maxWidth: 'auto', backgroundColor: 'transparent' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <DualInput>
                <InputBoxContainer>
                  <Field
                    as={InputBox}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                  />
                  <ErrorMsg name="name" component="div" className="error" />
                </InputBoxContainer>
                <InputBoxContainer>
                  <Field
                    as={InputBox}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                  />
                  <ErrorMsg name="email" component="div" className="error" />
                </InputBoxContainer>
              </DualInput>
              <div style={{ marginBottom: "25px" }}>
                <Field
                  as={TextAreaBox}
                  id="message"
                  name="message"
                  placeholder="Your Feedback"
                />
                <ErrorMsg name="message" component="div" className="error" />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                variant="contained"
                color="secondary"
              >
                <ButtonText variant="subtitle1" color="white" fontWeight="bold">
                  {submitting ? "Submitting" : "Submit"}{" "}
                </ButtonText>
              </Button>
            </Form>
          </Formik>
        </FormView>
      </ContactSectionContent>
    </ContactSection>
  );
};

export default Contact;
