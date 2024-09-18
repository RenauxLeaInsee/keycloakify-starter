import { useEffect } from "react";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useInsertScriptTags } from "keycloakify/tools/useInsertScriptTags";
import { useInsertLinkTags } from "keycloakify/tools/useInsertLinkTags";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { breakpointsValues } from "@codegouvfr/react-dsfr/fr/generatedFromCss/breakpoints";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import Header from "@codegouvfr/react-dsfr/Header";
import { fr } from "@codegouvfr/react-dsfr";
import Footer from "@codegouvfr/react-dsfr/Footer";
import { tss } from "../tss";
import { Divider } from "@mui/material";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes: classes_props,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes: classes_props });

    const { msg, msgStr } = i18n;

    const { locale, auth, url, message, isAppInitiatedAction, authenticationSession, scripts } = kcContext;
    const { classes, cx, css } = useStyles({ contentWidth: breakpointsValues.sm });

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    useEffect(() => {
        const { currentLanguageTag } = locale ?? {};

        if (currentLanguageTag === undefined) {
            return;
        }

        const html = document.querySelector("html");
        assert(html !== null);
        html.lang = currentLanguageTag;
    }, []);

    const { areAllStyleSheetsLoaded } = useInsertLinkTags({
        componentOrHookName: "Template",
        hrefs: !doUseDefaultCss
            ? []
            : [
                  `${url.resourcesCommonPath}/node_modules/@patternfly/patternfly/patternfly.min.css`,
                  `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
                  `${url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
                  `${url.resourcesCommonPath}/lib/pficon/pficon.css`,
                  `${url.resourcesPath}/css/login.css`
              ]
    });

    const { insertScriptTags } = useInsertScriptTags({
        componentOrHookName: "Template",
        scriptTags: [
            {
                type: "module",
                src: `${url.resourcesPath}/js/menu-button-links.js`
            },
            ...(authenticationSession === undefined
                ? []
                : [
                      {
                          type: "module",
                          textContent: [
                              `import { checkCookiesAndSetTimer } from "${url.resourcesPath}/js/authChecker.js";`,
                              ``,
                              `checkCookiesAndSetTimer(`,
                              `  "${authenticationSession.authSessionId}",`,
                              `  "${authenticationSession.tabId}",`,
                              `  "${url.ssoLoginInOtherTabsUrl}"`,
                              `);`
                          ].join("\n")
                      } as const
                  ]),
            ...scripts.map(
                script =>
                    ({
                        type: "text/javascript",
                        src: script
                    }) as const
            )
        ]
    });

    useEffect(() => {
        if (areAllStyleSheetsLoaded) {
            insertScriptTags();
        }
    }, [areAllStyleSheetsLoaded]);

    if (!areAllStyleSheetsLoaded) {
        return null;
    }

    return (
        <div className={cx(css({ height: "100vh" }))}>
            <Header
                brandTop={
                    <>
                        République
                        <br />
                        Française
                    </>
                }
                id="header"
                homeLinkProps={{
                    title: msgStr("homeLinkTitle"),
                    href: "/"
                }}
                quickAccessItems={[
                    {
                        iconId: "fr-icon-customer-service-fill",
                        linkProps: {
                            //   to: "/assistance",
                        },
                        text: msgStr("contactSupport")
                    },
                    {
                        iconId: "fr-icon-account-circle-fill",
                        linkProps: {
                            className: fr.cx("fr-btn--tertiary", "fr-translate")
                            //   to: "/connexion",
                        },
                        text: msgStr("logIn")
                    }
                ]}
                serviceTitle={msgStr("serviceTagline")}
                operatorLogo={{
                    alt: msgStr("operatorLogoAlt"),
                    imgUrl: `${url.resourcesPath}/img/logo-insee.png`,
                    orientation: "vertical"
                }}
            />
            <div className={cx(classes.main)}>
                <div className={cx(classes.card, "fr-py-md-7w", "fr-px-md-12w", "fr-px-2w", "fr-py-3w")}>
                    <header className={kcClsx("kcFormHeaderClass")}>
                        {(() => {
                            const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                <h4 id="kc-page-title">{headerNode}</h4>
                            ) : (
                                <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                    <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                        <div className="kc-login-tooltip">
                                            <i className={kcClsx("kcResetFlowIcon")}></i>
                                            <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                        </div>
                                    </a>
                                </div>
                            );

                            if (displayRequiredFields) {
                                return (
                                    <div className={kcClsx("kcContentWrapperClass")}>
                                        <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                            <span className="subtitle">
                                                <span className="required">*</span>
                                                {msg("requiredFields")}
                                            </span>
                                        </div>
                                        <div className="col-md-10">{node}</div>
                                    </div>
                                );
                            }

                            return node;
                        })()}
                    </header>
                    <div id="kc-content">
                        <div id="kc-content-wrapper">
                            {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                            {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                                <div
                                    className={clsx(
                                        `alert-${message.type}`,
                                        kcClsx("kcAlertClass"),
                                        `pf-m-${message?.type === "error" ? "danger" : message.type}`
                                    )}
                                >
                                    <div className="pf-c-alert__icon">
                                        {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                        {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                        {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                        {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                                    </div>
                                    <span
                                        className={kcClsx("kcAlertTitleClass")}
                                        dangerouslySetInnerHTML={{
                                            __html: message.summary
                                        }}
                                    />
                                </div>
                            )}
                            {children}
                            {auth !== undefined && auth.showTryAnotherWayLink && (
                                <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                    <div className={kcClsx("kcFormGroupClass")}>
                                        <input type="hidden" name="tryAnotherWay" value="on" />
                                        <a
                                            href="#"
                                            id="try-another-way"
                                            onClick={() => {
                                                document.forms["kc-select-try-another-way-form" as never].submit();
                                                return false;
                                            }}
                                        >
                                            {msg("doTryAnotherWay")}
                                        </a>
                                    </div>
                                </form>
                            )}
                            {socialProvidersNode}
                            {displayInfo && (
                                <div className={classes.helper}>
                                    <Divider variant="fullWidth" />
                                    {infoNode}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                accessibility="non compliant"
                // contentDescription={t("content description")}
                // operatorLogo={{
                //     alt: t("operator logo alt"),
                //     imgUrl: logoInsee,
                //     orientation: "vertical"
                // }}
                bottomItems={[headerFooterDisplayItem]}
            />
        </div>
    );
}

const useStyles = tss.create(({ breakpointsValues, windowInnerWidth }) => ({
    helper: {
        display: "flex",
        flexDirection: "column",
        gap: fr.spacing("3w")
    },
    card: {
        backgroundColor: fr.colors.decisions.background.default.grey.hover,
        width: (() => {
            if (windowInnerWidth < breakpointsValues.sm) {
                return "100vw";
            }

            if (windowInnerWidth < breakpointsValues.md) {
                return "80vw";
            }

            if (windowInnerWidth < breakpointsValues.xl) {
                return "60vw";
            }

            return "40vw";
        })()
    },
    main: {
        flex: 1,
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        ...fr.spacing("padding", { topBottom: "10v" }),
        width: (() => {
            if (windowInnerWidth < breakpointsValues.sm) {
                return `calc(100vw - ${fr.spacing("3v")})`;
            }

            if (windowInnerWidth < breakpointsValues.md) {
                return `calc(100vw - ${fr.spacing("10v")})`;
            }

            if (windowInnerWidth < breakpointsValues.xl) {
                return "80vw";
            }

            return "80vw";
        })()
    }
}));
