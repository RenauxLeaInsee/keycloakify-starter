import { createUseI18n } from "keycloakify/login";

export const { useI18n, ofTypeI18n } = createUseI18n({
    en: {
        login: "Log in",
        loginAccountTitle: "Login to the response portal for official statistics surveys",
        identifier: "Identifier",
        identifierHint: "Expected format: uppercase letters and numbers",
        contactSupport: "Contact support",
        logIn: "Log in",
        loginHelperTitle: "Login help",
        loginDescription:
            "To log in, please enter the identifier you received by email and/or mail, along with the password previously sent to you by mail.",
        helperLoginDescription:
            "For security reasons, the number of login attempts is limited.",
        helperLoginSupport: "If you are unable to log in, please ",
        contactSupportLink: "contact support.",
        homeLinkTitle: "Home - Response portal for official statistics surveys",
        serviceTagline: "Response portal for official statistics surveys",
        operatorLogoAlt: "Insee, measure to understand"
    },
    fr: {
        login: "Connexion",
        loginAccountTitle:
            "Connexion au portail de réponses des enquêtes de la statistiques publiques",
        identifier: "Identifiant",
        identifierHint: "Format attendu : lettres et chiffres en majuscules",
        contactSupport: "Contacter l'assistance",
        logIn: "Se connecter",
        loginHelperTitle: "Aide à la connexion",
        helperLoginDescription:
            "Pour des raisons de sécurité, le nombre de tentatives de connexion est limité.",
        helperLoginSupport: "Si vous ne parvenez pas à vous connecter, veuillez ",
        contactSupportLink: "contacter l'assistance.",
        loginDescription:
            "Pour vous connecter, veuillez saisir l'identifiant que vous avez reçu par mail et/ou par courrier, ainsi que le mot de passe qui vous a été précédemment transmis par courrier.",
        homeLinkTitle:
            "Accueil - Portail de réponse aux enquêtes de la statistique publique",
        serviceTagline: "Portail de réponse aux enquêtes de la statistique publique",
        operatorLogoAlt: "Insee, mesurer pour comprendre"
    }
});

export type I18n = typeof ofTypeI18n;
