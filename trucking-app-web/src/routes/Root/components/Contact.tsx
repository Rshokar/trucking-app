import styled from "styled-components";
import { Container } from "../../../components/shared";
import { Typography, Button, Input, TextareaAutosize } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useState } from "react";

const ContactContainer = styled(Container)`
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-bottom: 5rem;
  width: 100vw;
`;

const InputBox = styled(Input)``;

const InputBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const TextAreaBox = styled(TextareaAutosize)`
  width: 100%;
  border-top: none;
  border-left: none;
  border-right: none;
  padding-bottom: 5rem;
  &::placeholder {
    /* Define your placeholder styles here */
    font-size: 12pt;
    color: #7b7b7b; /* Placeholder text color */
    font-family: sans-serif;
  }
`;

const ButtonText = styled(Typography)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMsg = styled(ErrorMessage)({
  color: "red",
  fontSize: "10pt",
});

const Contact: React.FC = () => {
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
    <ContactContainer>
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        Contact Us!
      </Typography>
      <Typography variant="subtitle2" fontWeight="bold">
        Get in touch and let us know how we can help.
      </Typography>

      <div style={{ width: "50vw" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: "30px",
              }}
            >
              <InputBoxContainer>
                <Field
                  as={InputBox}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                />
                <ErrorMsg name="name" component="div" className="error" />
              </InputBoxContainer>
              <InputBoxContainer>
                <Field
                  as={InputBox}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
                <ErrorMsg name="email" component="div" className="error" />
              </InputBoxContainer>
            </div>
            <div style={{ marginBottom: "25px" }}>
              <Field
                as={TextAreaBox}
                id="message"
                name="message"
                placeholder="What can we help you with?"
              />
              <ErrorMsg name="message" component="div" className="error" />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              variant="contained"
              color="primary"
              fullWidth
            >
              <ButtonText variant="button" color="white" fontWeight="bold">
                {submitting ? "Submitting" : "Submit"}{" "}
              </ButtonText>
            </Button>
          </Form>
        </Formik>
      </div>
    </ContactContainer>
  );
};

export default Contact;
