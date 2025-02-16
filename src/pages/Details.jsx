import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { capitalizeFirstLetter } from "../components/toUpperCase";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { LinkIcon } from "@heroicons/react/20/solid";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

import { DetailsGrid } from "../components/detailsComponents/DetailsGrid";
import loader from "../assets/loader.gif";
import MissingImage from "../assets/missing.svg";
import { downloadCertFile } from "../api/certFile";
import { ArrowDownOnSquareStackIcon } from "@heroicons/react/24/outline";

export const Details = () => {
  const diamonds = useSelector((state) => state.app.diamondData);
  const rates = useSelector((state) => state.app.rates);
  const currency = useSelector((state) => state.app.currency);
  const warehouses = useSelector((state) => state.app.warehouses);

  const location = useLocation();
  const navigate = useNavigate();

  const diamondID = location.pathname.split("/")[2];
  const [diamond, setDiamond] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  let spotPrice = useRef(0);

  let missingImage = false;
  if (
    diamond &&
    !diamond["video_link"].includes("videos.gem360.in") &&
    !diamond["video_link"].includes("view.gem360.in") &&
    !diamond["video_link"].includes("loupe360.com") &&
    !diamond["video_link"].includes("viw-us.s3.amazonaws.com") &&
    !diamond["video_link"].includes("www.v360videos.com") &&
    !diamond["video_link"].includes("v360.diamonds")
  ) {
    missingImage = true;
  }

  useEffect(() => {
    const foundDiamond = diamonds.find(
      (diamond) => String(diamond.id) === String(diamondID)
    );
    if (!foundDiamond) {
      return;
    }
    setDiamond(foundDiamond);
    if (foundDiamond.total) {
      spotPrice.current = (
        (parseFloat(foundDiamond.total) * rates[currency.code] * 10) /
        10
      ).toFixed(2);
    } else {
      spotPrice.current = null;
    }
  }, [diamonds]);

  const formatNumberWithSpaces = (number) => {
    const formatter = new Intl.NumberFormat("en-US");
    return formatter.format(number).replace(/,/g, ",");
  };

  let warehouse = {};

  let videoLinkFormat = "hidden";
  if (diamond) {
    videoLinkFormat = diamond["video_link"].includes("view.gem360.in")
      ? "iframe-container-details"
      : diamond["video_link"].includes("videos.gem360.in")
      ? "iframe-container-second-details"
      : diamond["video_link"].includes("loupe360.com")
      ? "iframe-container-loupe"
      : diamond["video_link"].includes("viw-us.s3.amazonaws.com")
      ? "iframe-container-viw"
      : diamond["video_link"].includes("www.v360videos.com")
      ? "iframe-container-details-view"
      : diamond["video_link"].includes("v360.diamonds")
      ? "iframe-container-details-diamonds"
      : "hidden";

    warehouse = warehouses.find(
      (warehouse) => warehouse.id === diamond.warehouse_id
    );
  }

  return (
    <>
      <div className="w-full pb-4 bg-light-grey">
        <div className="border-0 pt-28 h-full ml-6 mr-12">
          <div
            onClick={() => {
              navigate("/");
            }}
            className="flex text-white items-center ml-40 mb-2 pr-2 w-24 py-1 rounded-md bg-secondary hover:bg-black/80 cursor-pointer"
          >
            <ChevronLeftIcon className="w-7 h-7 mr-2 rounded-sm" />
            <p className="h-5 mb-[3px]">Return</p>
          </div>
          <div className=" flex h-[full] w-[75%] mx-auto bg-secondary p-8 border-solid border-[1px] shadow-lg">
            {diamond && (
              <>
                <div className="w-[25%] py-2">
                  <div
                    className={`pr-4 ${
                      missingImage
                        ? "w-[200px] h-[180px]"
                        : "w-[94%] bg-[#0d080c]"
                    }`}
                  >
                    {!missingImage ? (
                      <div
                        className={`${videoLinkFormat} border-none ${
                          !isLoaded && "hidden"
                        }`}
                      >
                        <iframe
                          src={diamond["video_link"]}
                          onLoad={() => {
                            setIsLoaded(true);
                          }}
                          className="iframe-custom my-2 border-none rounded-none"
                        ></iframe>
                      </div>
                    ) : (
                      <img
                        className="w-[200px] h-[180px] my-2"
                        src="/assets/missing.png"
                      />
                    )}
                  </div>

                  {!isLoaded && !missingImage && (
                    <div className={`${videoLinkFormat} border-none`}>
                      <div className="iframe-custom h-full my-2 bg-light-grey flex items-center justify-center">
                        <img className="w-5 h-5" src={loader} />
                      </div>{" "}
                      :
                    </div>
                  )}
                  {!missingImage && (
                    <div
                      onClick={() =>
                        navigator.clipboard.writeText(diamond["video_link"])
                      }
                      className="flex mt-8 cursor-pointer"
                    >
                      <div className="h-8 w-24 bg-text rounded-md border-solid border-grey border-[1.5px] flex justify-center items-center hover:border-black">
                        <p className="text-xs font-semibold">Copy Video Link</p>
                      </div>
                    </div>
                  )}
                  <div className="flex">
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <div className="w-[75%] py-2 text-sm">
                  <div className="pb-2 font-bold text-xl text-primary">
                    {capitalizeFirstLetter(diamond.shape)}{" "}
                    {diamond.specifications.carat}ct{" "}
                    {diamond.specifications.clarity}{" "}
                    {diamond.specifications.cut.toUpperCase()}{" "}
                    {diamond.finish.polish.toUpperCase()}{" "}
                    {diamond.finish.symmetry.toUpperCase()}{" "}
                    {capitalizeFirstLetter(diamond.finish.fluorescence)}
                  </div>
                  <div className="flex">
                    <div className="flex">
                      <p className="pr-2 text-primary">
                        Cert ID {diamond.certificate}:
                      </p>
                      {diamond.certificate === "IGI" ? (
                        <>
                          {/* <a
                            className="text-text font-bold border-0 border-solid border-b-[1px]"
                            target="_blank"
                            rel="noreferrer"
                            href={`http://www.igi.org/verify.php?r=${diamond.cert_id}`}
                          >
                            {diamond.cert_id}
                          </a> */}
                          {/* <ClipboardDocumentIcon
                            className="w-5 h-5 text-text ml-2 mt-[1px] cursor-pointer"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                "http://www.igi.org/verify.php?r=" +
                                  diamond.cert_id
                              )
                            }
                          /> */}
                        </>
                      ) : (
                        <>
                          <button
                            className="text-text font-bold border-0 border-solid border-b-[1px] bg-black"
                            onClick={() => downloadCertFile(diamond.cert_id)}
                          >
                            {diamond.cert_id}
                          </button>
                          <ArrowDownOnSquareStackIcon
                            className="w-5 h-5 text-text ml-2 mt-[1px] cursor-pointer"
                            onClick={() => downloadCertFile(diamond.cert_id)}
                          />
                        </>
                      )}
                    </div>
                    <div className="ml-4 flex">
                      <p className="pr-2 text-primary">Stock ID:</p>
                      <p className="font-bold text-text">{diamond.id}</p>
                    </div>
                  </div>
                  <div className="flex mt-4 mb-2 ">
                    <div>
                      <div className="flex">
                        <div className="mr-10">
                          <p className="text-primary">Delivery Time:</p>
                          <div className="flex mb-2">
                            <p className="text-text">
                              {warehouse.delivery_from}
                            </p>
                            <p className="mx-2 text-text"> - </p>
                            <p className="text-text">{warehouse.delivery_to}</p>
                            <p className="ml-2 text-text">Days</p>
                          </div>
                        </div>
                        <div>
                          <div className="text-primary">Location:</div>
                          <div className="text-text">{warehouse.country}</div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-auto">
                      <p className="pb-2 text-primary">Total Price</p>
                    </div>

                    {spotPrice.current ? (
                      <div className="w-36 text-left pl-[5%]">
                        <p className="text-text">
                          ${formatNumberWithSpaces(diamond["total"])}
                        </p>
                        <p className="text-text">
                          {formatNumberWithSpaces(spotPrice.current)}{" "}
                          {currency.code}
                        </p>
                        <p className="text-text">
                          {currency.symbol}{" "}
                          {formatNumberWithSpaces(
                            (
                              spotPrice.current /
                              parseFloat(diamond.specifications.carat)
                            ).toFixed(2)
                          )}
                          /ct
                        </p>
                      </div>
                    ) : (
                      <div className="w-28 text-left ml-[70px]">
                        <p className="text-text">-</p>
                        <p className="text-text">-</p>
                        <p className="text-text">-</p>
                      </div>
                    )}
                  </div>

                  <DetailsGrid diamond={diamond} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="section-details">
        <div className="section-details-content">
          <div className="section-details-child">
          {diamond && (
            <><div className="pb-2 font-bold text-xl text-primary">
                {capitalizeFirstLetter(diamond.shape)}{" "}
                {diamond.specifications.carat}ct {diamond.specifications.clarity}{" "}
                {diamond.specifications.cut.toUpperCase()}{" "}
                {diamond.finish.polish.toUpperCase()}{" "}
                {diamond.finish.symmetry.toUpperCase()}{" "}
                {capitalizeFirstLetter(diamond.finish.fluorescence)}
              </div><div className="flex flex-col mb-4">
                  <div className="flex items-center mb-2">
                    <p className="pr-2 text-primary">
                      Cert ID {diamond.certificate}:
                    </p>
                    {diamond.certificate === "IGI" ? (
                      <>
                        <a
                          className="text-text font-bold border-b-[1px]"
                          target="_blank"
                          rel="noreferrer"
                          href={`http://www.igi.org/verify.php?r=${diamond.cert_id}`}
                        >
                          {diamond.cert_id}
                        </a>
                        <ClipboardDocumentIcon
                          className="w-5 h-5 text-text ml-2 cursor-pointer"
                          onClick={() => navigator.clipboard.writeText(
                            "http://www.igi.org/verify.php?r=" + diamond.cert_id
                          )} />
                      </>
                    ) : (
                      <>
                        <button
                          className="text-text font-bold border-b-[1px] bg-black"
                          onClick={() => downloadCertFile(diamond.cert_id)}
                        >
                          {diamond.cert_id}
                        </button>
                        <ArrowDownOnSquareStackIcon
                          className="w-5 h-5 text-text ml-2 cursor-pointer"
                          onClick={() => downloadCertFile(diamond.cert_id)} />
                      </>
                    )}
                  </div>
                  <div className="flex items-center">
                    <p className="pr-2 text-primary">Stock ID:</p>
                    <p className="font-bold text-text">{diamond.id}</p>
                  </div>
                </div><div className="flex-details">
                  <div className="mb-2">
                    <p className="text-primary">Delivery Time:</p>
                    <div className="flex items-center">
                      <p className="text-text">{warehouse.delivery_from}</p>
                      <p className="mx-2 text-text"> - </p>
                      <p className="text-text">{warehouse.delivery_to}</p>
                      <p className="ml-2 text-text">Days</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-primary">Location:</p>
                    <p className="text-text">{warehouse.country}</p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="pb-2 text-primary">Total Price</p>
                  {spotPrice.current ? (
                    <div className="text-left">
                      <p className="text-text">
                        ${formatNumberWithSpaces(diamond["total"])}
                      </p>
                      <p className="text-text">
                        {formatNumberWithSpaces(spotPrice.current)} {currency.code}
                      </p>
                      <p className="text-text">
                        {currency.symbol}{" "}
                        {formatNumberWithSpaces(
                          (
                            spotPrice.current /
                            parseFloat(diamond.specifications.carat)
                          ).toFixed(2)
                        )}
                        /ct
                      </p>
                    </div>
                  ) : (
                    <div className="text-left">
                      <p className="text-text">-</p>
                      <p className="text-text">-</p>
                      <p className="text-text">-</p>
                    </div>
                  )}
                </div><DetailsGrid diamond={diamond} /></>
          )}
          </div>
        </div>
      </div>

   
    </>
  );
};
