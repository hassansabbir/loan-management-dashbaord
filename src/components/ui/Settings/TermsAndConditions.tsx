import { Button } from "antd";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="w-[70%]">
      <h1 className="text-2xl font-semibold">Terms & Conditions </h1>
      <p className="my-10">
        Lorem ipsum dolor sit amet consectetur. Fringilla a cras vitae orci.
        Egestas duis id nisl sed ante congue scelerisque. Eleifend facilisis
        aliquet tempus morbi leo sagittis. Pellentesque odio amet turpis
        habitant. Imperdiet tincidunt nisl consectetur hendrerit accumsan
        vehicula imperdiet mattis. Neque a vitae diam pharetra duis habitasse
        convallis luctus pulvinar. Pharetra nunc morbi elementum nisl magnis
        convallis arcu enim tortor. Cursus a sed tortor enim mi imperdiet massa
        donec mauris. Sem morbi morbi posuere faucibus. Cras risus ultrices duis
        pharetra sit porttitor elementum sagittis elementum. Ut vitae blandit
        pulvinar fermentum in id sed. At pellentesque non semper eget egestas
        vulputate id volutpat quis. Dolor etiam sodales at elementum mattis nibh
        quam placerat ut. Suspendisse est adipiscing proin et. Leo nisi bibendum
        donec ac non eget euismod suscipit. At ultricies nullam ipsum tellus.
        Non dictum orci at tortor convallis tortor suspendisse. Ac duis senectus
        arcu nullam in suspendisse vitae. Tellus interdum enim lorem vel morbi
        lectus.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur. Fringilla a cras vitae orci.
        Egestas duis id nisl sed ante congue scelerisque. Eleifend facilisis
        aliquet tempus morbi leo sagittis. Pellentesque odio amet turpis
        habitant. Imperdiet tincidunt nisl consectetur hendrerit accumsan
        vehicula imperdiet mattis. Neque a vitae diam pharetra duis habitasse
        convallis luctus pulvinar. Pharetra nunc morbi elementum nisl magnis
        convallis arcu enim tortor. Cursus a sed tortor enim mi imperdiet massa
        donec mauris. Sem morbi morbi posuere faucibus. Cras risus ultrices duis
        pharetra sit porttitor elementum sagittis elementum. Ut vitae blandit
        pulvinar fermentum in id sed. At pellentesque non semper eget egestas
        vulputate id volutpat quis. Dolor etiam sodales at elementum mattis nibh
        quam placerat ut. Suspendisse est adipiscing proin et. Leo nisi bibendum
        donec ac non eget euismod suscipit. At ultricies nullam ipsum tellus.
        Non dictum orci at tortor convallis tortor suspendisse. Ac duis senectus
        arcu nullam in suspendisse vitae. Tellus interdum enim lorem vel morbi
        lectus.
      </p>
      <Link to={"/edit-terms-and-conditions"}>
        <Button className="px-20 py-6 mt-10 bg-[#FFD900] rounded-xl">
          Edit
        </Button>
      </Link>
    </div>
  );
};

export default TermsAndConditions;