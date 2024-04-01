
import { faCheck, faSpinner, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AddressType {
    blockchain: string;
    symbol: string;
    address?: string;
}

interface TransactionType {
    id: string;
    from: AddressType;
    to: AddressType;
    input: number;
    output: number;
    steps: [{
        from: AddressType;
        to: AddressType;
        swapperId: string;
        input: number;
        output: number;
        status: string;
    }];
    status: string;
}

interface TransactionItemProps {
    item: TransactionType;
}

export default function TransactionItem(props: TransactionItemProps) {
    const { id, from, to, input, output, steps, status } = props.item;

    const renderAddressType = (addr: AddressType, value: number) => {
        return <span className="font-bold">
            {`${value} ${addr.symbol} (${addr.blockchain})`}
        </span>
    }

    const renderStatus = (status: string) => {
        if (status === "success")
            return <FontAwesomeIcon icon={faCheck} color="green" />
        if (status === "running")
            return <FontAwesomeIcon icon={faSpinner} color="orange" />
        return <FontAwesomeIcon icon={faQuestion} color="red" />
    }

    return <div className="p-4">
        <div>
            {renderAddressType(from, input)}
            {" -> "}
            {renderAddressType(to, output)}
            {" "}
            {renderStatus(status)}
        </div>
        <div className="p-4">
            {
                steps.map((step, i) => {
                    return <div key={i}>
                        {"=> "}
                        {renderAddressType(step.from, step.input)}
                        {" -> "}
                        {renderAddressType(step.to, step.output)}
                        {" via "}
                        <b>{step.swapperId}</b>
                        {" "}
                        {renderStatus(step.status)}
                    </div>;
                })
            }
        </div>
    </div>;
}