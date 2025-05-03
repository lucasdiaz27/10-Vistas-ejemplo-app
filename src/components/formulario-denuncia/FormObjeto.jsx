import React from "react";
import { FormCheckBox } from "./FormCheckBox";

export const FormObjeto = ({register, errors}) => {
  return (
    <>
      <div className=" mb-4">
        <div className="">
          <FormCheckBox errors={errors} register={register} />
        </div>
      </div>
    </>
  );
};
