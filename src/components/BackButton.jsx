import { useNavigate } from "react-router-dom";

import { Button } from "./Button";

export const BackButton = () => {
  const navigate = useNavigate();
  console.log(navigate)

  return (
    <Button type="back" onClick={(e) => {
      e.preventDefault();
      navigate(-1);
    }}>&larr; Back</Button>
  )
}
