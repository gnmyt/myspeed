import {DialogProvider} from "@/common/contexts/Dialog";
import "./styles.sass";

export const LoadingDialog = (props) => {

    return (
        <>
            {props.isOpen && <DialogProvider disableClosing={true} customClass="dialog-speedtest">
                <div className="dialog-speedtest">
                <div className="lds-ellipsis">
                    <div/><div/><div/><div/>
                </div>
                </div>
            </DialogProvider>}
        </>
    )
}