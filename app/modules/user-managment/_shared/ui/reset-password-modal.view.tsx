import {useEffect, useState} from "react";
import QRCode from 'qrcode';

export const ResetPasswordModal = ({show, user, setShow}) => {
    const [onModalQRCode, setonModalQRCode] = useState(undefined);

    const generateQRCode = async () => {
        try {
            setonModalQRCode(undefined)

            const res = await fetch(`/api/auth/get-reset-password-link?email=${encodeURIComponent(user.email)}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de la génération du lien');
            }

            const resetLink = data.resetLink;

            const codeSrc = await QRCode.toDataURL(resetLink, {
                width: 256,
                margin: 0,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })

            setonModalQRCode(codeSrc)
        } catch (err) {
            alert('Erreur lors de la génération du QR code');
            // console.error(err)
        }
    }

    useEffect(() => {
        if (show && user?.email) {
            generateQRCode();
        }
    }, [show, user]);


    if (!show) {
        return <></>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black rounded-lg p-6 w-11/12 max-w-md max-h-[100vh] overflow-auto">
                <h3 className="text-lg font-semibold mb-4">Réinitialisation du mot de passe</h3>
                {user && (
                    <>
                        <p className="text-lg font-semibold mt-8 text-center w-full">{user.name}</p>
                        <p className="text-xs font-semibold mb-8 text-center text-gray-600 dark:text-gray-400 w-full">{user.email}</p>
                    </>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-4">Scannez ce QR code pour rediriger l'utilisateur vers
                    la page de réinitialisation du mot de passe.</p>
                {onModalQRCode ? (
                    <div id={'qrcode'} className="flex justify-center p-4 bg-white my-8">
                        <img src={onModalQRCode} alt="QR Code"/>
                    </div>) : (
                    <div className="text-center py-8">
                        <div
                            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600 text-sm">Génération du QR code...</p>
                    </div>
                )}
                <button
                    onClick={() => setShow(false)}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                    Fermer
                </button>
            </div>
        </div>
    )
}