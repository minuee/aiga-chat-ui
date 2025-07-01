import React from 'react';
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useColorModeValue } from '@chakra-ui/react';

type AlertProps = {
    AppName: string;
    bodyContent: any;
    isOpen: boolean;
    closeText: string;
    confirmText: string;
    onClose: (isBool?: boolean) => void;
    onConfirm: () => void;
    isCentered?: boolean;
};
  
const Alert = ({ AppName, bodyContent, isOpen, onClose, onConfirm, closeText, confirmText, isCentered = false }:AlertProps) => {

    const confirmRef = React.useRef();
    const bgColor = useColorModeValue('white', 'navy.700');

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={confirmRef as any}
            onClose={() => onClose(true)}
            isCentered={isCentered}
        >
            <AlertDialogOverlay>
                <AlertDialogContent backgroundColor={bgColor}  maxW={{base : "90%", md:"400px"}}>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {AppName}
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        {bodyContent}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                    <Button ref={confirmRef as any} onClick={() => onClose(true)} id="button_close">
                        {closeText}
                    </Button>
                    <Button colorScheme='red' onClick={() => onConfirm()} ml={3} id="button_confirm">
                        {confirmText}
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
};

export default React.memo(Alert);