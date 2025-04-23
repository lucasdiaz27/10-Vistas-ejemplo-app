import React from "react";
import { FormCheckBox } from "./FormCheckBox";

export const FormObjeto = ({register}) => {
  return (
    <>
      <div className=" mb-4">
        <div className="">
          <FormCheckBox register={register} />
        </div>
      </div>
    </>
  );
};
