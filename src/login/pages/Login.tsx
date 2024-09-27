import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { tss } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes: classes_props } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes: classes_props
    });

    const { realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const { classes, cx } = useStyles();

    return (
        <main>
            <Template
                kcContext={kcContext}
                i18n={i18n}
                doUseDefaultCss={doUseDefaultCss}
                classes={classes_props}
                displayMessage={!messagesPerField.existsError("username", "password")}
                headerNode={msg("loginAccountTitle")}
                displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
                infoNode={
                    <div>
                        <h4>{msg("loginHelperTitle")}</h4>
                        <p>{msg("helperLoginDescription")}</p>
                        <p style={{ margin: 0 }}>
                            {msgStr("helperLoginSupport")}
                            <Button
                                style={{ padding: 0, display: "inline" }}
                                priority="tertiary no outline"
                                linkProps={{
                                    tabIndex: 7,
                                    href: "/assitance"
                                }}
                            >
                                {msgStr("contactSupportLink")}
                            </Button>
                        </p>
                    </div>
                }
            >
                <p className={classes.subtitle}>{msg("loginDescription")}</p>
                <div id="kc-form">
                    <div id="kc-form-wrapper">
                        {realm.password && (
                            <form
                                id="kc-form-login"
                                onSubmit={() => {
                                    setIsLoginButtonDisabled(true);
                                    return true;
                                }}
                                action={url.loginAction}
                                method="post"
                            >
                                {messagesPerField.existsError("username", "password") && (
                                    <span
                                        id="input-error"
                                        className={kcClsx("kcInputErrorMessageClass")}
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{ __html: messagesPerField.getFirstError("username", "password") }}
                                    />
                                )}
                                {!usernameHidden && (
                                    <div className={cx(kcClsx("kcFormGroupClass"), "fr-pb-3w")}>
                                        <Input
                                            nativeInputProps={{
                                                tabIndex: 2,
                                                id: "username",
                                                name: "username",
                                                type: "text",
                                                defaultValue: login.username ?? "",
                                                "aria-invalid": messagesPerField.existsError("username", "password"),
                                                ...(usernameHidden
                                                    ? { disabled: true }
                                                    : {
                                                          autoFocus: true,
                                                          autoComplete: "off"
                                                      })
                                            }}
                                            label={msgStr("identifier")}
                                            hintText={msgStr("identifierHint")}
                                        />
                                    </div>
                                )}

                                <div className={kcClsx("kcFormGroupClass")}>
                                    <PasswordInput label={msgStr("password")} id="password" nativeInputProps={{ name: "password" }} />
                                </div>

                                {realm.resetPasswordAllowed && (
                                    <Button
                                        style={{ padding: 0, textDecoration: "underline" }}
                                        priority="tertiary no outline"
                                        linkProps={{
                                            tabIndex: 6,
                                            href: url.loginResetCredentialsUrl
                                        }}
                                    >
                                        {msg("doForgotPassword")}
                                    </Button>
                                )}

                                <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                    <Button
                                        nativeButtonProps={{ type: "submit", name: "login", tabIndex: 7 }}
                                        style={{ width: "100%", display: "flex", justifyContent: "center" }}
                                        disabled={isLoginButtonDisabled}
                                    >
                                        {msg("login")}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </Template>
        </main>
    );
}

const useStyles = tss.withName({ Login }).create({
    subtitle: {
        color: fr.colors.decisions.text.title.grey.default
    }
});
