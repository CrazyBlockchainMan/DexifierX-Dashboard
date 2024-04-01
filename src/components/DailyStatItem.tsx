
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DailyStatType {
    date: string;
    success: number;
    failure: number;
    volumeUsd: number;
    volumeUsdFirstStep: number;
    directFee: number;
    manualFee: number;
}

interface DailyStatProps {
    item: DailyStatType;
}

export default function DailyStatItem(props: DailyStatProps) {
    const { date, success, failure, volumeUsd, volumeUsdFirstStep, directFee, manualFee } = props.item;
    const total = success + failure;

    return <div className="p-4">
        <b className="pr-4">{`${date}: `}</b>
        {failure === 0 ?
            <FontAwesomeIcon icon={faCheck} color="green" />
            :
            <FontAwesomeIcon icon={faXmark} color="red" />
        }
        {" "}
        <b>{`${success}/${total}`}</b>
        {", volumeUsd = "}
        <b>{volumeUsd}</b>
        {", volumeUsdFirstStep = "}
        <b>{volumeUsdFirstStep}</b>
        {", directFee = "}
        <b>{directFee}</b>
        {", manualFee = "}
        <b>{manualFee}</b>
    </div>;
}