import {useEffect} from "react";
import {useConfig} from "@/app/modules/config/store/config.store";

export const withConfig = <P extends Record<string, any>>(
    Component: React.ComponentType<P>
) => {
    const WrappedComponent = (props: P) => {

        const loadConfig = async () => {
            try {
                useConfig.setState({loading: true});
                const response = await fetch('/api/config');
                if (!response.ok) throw new Error('Erreur lors du chargement de la configuration');
                const data = await response.json();

                useConfig.setState({
                    config: data,
                    loading: false,
                    error: undefined
                });
            } catch (err) {
                console.log('erreur')
                useConfig.setState({
                    error: 'Erreur lors du chargement de la configuration',
                    loading: false
                });
            }
        };

        useEffect(() => {
            loadConfig();

            const interval = setInterval(loadConfig, 5 * 60 * 1000);

            return () => {
                clearInterval(interval);
            };
        }, []);

        return <Component {...props} />;
    };

    WrappedComponent.displayName = `withConfig(${Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
};