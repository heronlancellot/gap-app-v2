/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { FC, useEffect, useMemo, useState } from "react";
import { blo } from "blo";
import { Hex } from "viem";
import { useENSNames } from "@/store/ensNames";
import { shortAddress } from "@/utilities/shortAddress";
import { formatDate } from "@/utilities/formatDate";
import { EmptyEndorsmentList } from "./EmptyEndorsmentList";
import { useProjectStore } from "@/store";
import { ProjectEndorsement } from "@show-karma/karma-gap-sdk";
import pluralize from "pluralize";
import { Button } from "@/components/Utilities/Button";
import { MarkdownPreview } from "@/components/Utilities/MarkdownPreview";

interface EndorsementRowProps {
  endorsement: ProjectEndorsement;
}

const EndorsementRow: FC<EndorsementRowProps> = ({ endorsement }) => {
  const { ensNames } = useENSNames();

  return (
    <div className="flex flex-col w-full p-4 gap-3">
      <div className="flex flex-row gap-2 w-full items-start">
        <div className="flex flex-row gap-2 w-full items-center">
          <img
            src={blo(endorsement.recipient, 6)}
            alt={endorsement.recipient}
            className="h-6 w-6 rounded-full"
          />
          <div className="flex flex-row gap-3 w-full items-start justify-between">
            <p className="text-sm font-bold text-[#101828] dark:text-zinc-100">
              {ensNames[endorsement?.recipient]?.name ||
                shortAddress(endorsement.recipient)}
              {` `}
              <span className="text-sm font-normal text-[#344054] dark:text-zinc-200">
                endorsed this on {formatDate(endorsement.createdAt)}
              </span>
            </p>
          </div>
        </div>
      </div>
      {endorsement.comment ? (
        <div className="text-left px-0 flex flex-row items-start">
          <p className="text-sm text-[#344054] dark:text-zinc-100  font-normal">
            <div
              className="w-full break-normal text-base font-normal text-black dark:text-zinc-100 max-2xl:text-sm"
              data-color-mode="light"
            >
              <MarkdownPreview source={endorsement.comment} />
            </div>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export const EndorsementList: FC = () => {
  const project = useProjectStore((state) => state.project);
  const [handledEndorsements, setHandledEndorsements] = useState<
    ProjectEndorsement[]
  >([]);
  const itemsPerPage = 12; // Set the total number of items you want returned from the API
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalEndorsements, setTotalEndorsements] = useState<number>(0);

  const { populateEnsNames } = useENSNames();

  useMemo(() => {
    const endorsements = project?.endorsements || [];
    const allAddresses = endorsements.map(
      (endorsement) => endorsement.recipient
    );
    populateEnsNames(allAddresses);

    const checkUniqueEndorsements = () => {
      const addresses: Record<Hex, ProjectEndorsement> = {};
      endorsements.forEach((endorsement) => {
        if (addresses[endorsement.recipient]) {
          if (
            new Date(addresses[endorsement.recipient].createdAt) <
            new Date(endorsement.createdAt)
          ) {
            addresses[endorsement.recipient] = endorsement;
          }
        } else {
          addresses[endorsement.recipient] = endorsement;
        }
      });
      const uniqueEndorsements = Object.values(addresses);
      const ordered = uniqueEndorsements.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const sliced = ordered.slice(0, itemsPerPage * page);
      const canLoadMore = uniqueEndorsements.length !== sliced.length;
      setTotalEndorsements(uniqueEndorsements.length);
      setHasMore(canLoadMore);
      setHandledEndorsements(sliced);
    };
    checkUniqueEndorsements();
  }, [project?.endorsements, populateEnsNames, page]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-row gap-2 justify-between items-center">
        <h3 className="font-bold text-[#101828] dark:text-zinc-100 text-lg">
          Endorsements
        </h3>
        {totalEndorsements ? (
          <div className="flex flex-row gap-2 items-center">
            <Image
              width={12}
              height={12}
              src="/icons/trending.svg"
              alt="Trending"
            />
            <p className="text-[#F79009] text-xs font-bold">
              This project has been endorsed {totalEndorsements}{" "}
              {pluralize("time", totalEndorsements)}
            </p>
          </div>
        ) : null}
      </div>
      {handledEndorsements.length ? (
        <div className="flex flex-col gap-0 divide-y divide-y-gray-200  rounded-xl border border-gray-200">
          {handledEndorsements.map((endorsement, index) => (
            <EndorsementRow key={index} endorsement={endorsement} />
          ))}
          {hasMore ? (
            <div className="w-full flex flex-row justify-center items-center py-2 px-4">
              <Button
                onClick={() => {
                  setPage((old) => old + 1);
                }}
                className="w-max text-base bg-black dark:text-black dark:bg-white hover:bg-black dark:hover:bg-white"
              >
                See more
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyEndorsmentList />
      )}
    </div>
  );
};
