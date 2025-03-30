*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem
Library    DateTime

*** Variables ***
${BROWSER}    chrome
${URL}    http://localhost:5173/
${DELAY}    0
${SCREENSHOT_DIR}    screenshots

*** Keywords ***
Capture Step Screenshot
    [Arguments]    ${step_name}
    ${timestamp}=    Get Current Date    result_format=%Y%m%d_%H%M%S
    Capture Page Screenshot    ${SCREENSHOT_DIR}/${step_name}_${timestamp}.png

*** Test Cases ***

Login As User
    Open Browser    ${URL}    ${BROWSER}
    Set Selenium Speed    ${DELAY}
    Maximize Browser Window
    Capture Step Screenshot    user_login_start
    
    # Select User Role
    Wait Until Element Is Visible    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Click Element    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Capture Step Screenshot    user_role_selected
    
    # Input Login Credentials
    Wait Until Element Is Visible    id=email-input
    Input Text    id=email-input    phattarapong.phe@spumail.net
    Input Password    id=password-input    1329900959999
    Capture Step Screenshot    user_credentials_entered
    
    # Click Login Button
    Click Element    id=login-submit-btn
    
    # Verify Login Success
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'swal2-popup')]
    Element Should Contain    xpath=//h2[contains(@class, 'swal2-title')]    เข้าสู่ระบบสำเร็จ!
    Capture Step Screenshot    user_login_success
    
    [Teardown]    Close Browser

Invalid Login Attempt
    Open Browser    ${URL}    ${BROWSER}
    Set Selenium Speed    ${DELAY}
    Maximize Browser Window
    Capture Step Screenshot    invalid_login_start
    
    # Select User Role
    Wait Until Element Is Visible    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Click Element    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Capture Step Screenshot    invalid_role_selected
    
    # Input Invalid Credentials
    Wait Until Element Is Visible    id=email-input
    Input Text    id=email-input    invalid@example.com
    Input Password    id=password-input    wrongpassword
    Capture Step Screenshot    invalid_credentials_entered
    
    # Click Login Button
    Click Element    id=login-submit-btn
    
    # Verify Error Message
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'swal2-popup')]
    Element Should Contain    xpath=//div[contains(@class, 'swal2-html-container')]    Invalid email or password
    Capture Step Screenshot    invalid_login_error
    
    [Teardown]    Close Browser 

Register As User
    Open Browser    ${URL}    ${BROWSER}
    Set Selenium Speed    ${DELAY}
    Maximize Browser Window
    Capture Step Screenshot    user_login_start
    
    # Select User Role
    Wait Until Element Is Visible    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Click Element    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Capture Step Screenshot    user_role_selected
    
    # Select Register
    Click Element  id=signup-btn

    # Input Register Credentials
    Wait Until Element Is Visible    id=signup-form
    Input Text    id=name-input    Athitiya Chaisiriwatthanachai
    Input Text    id=company-input    Uknowme Asset
    Input Text    id=citizen-id-input    1234567899998
    Input Text    id=email-input    athitiya.chaisiriwatthanachai991@uknowme.com
    Input Text    id=phone-input    0966566414
    Capture Step Screenshot    user_credentials_entered
    
    # Click Register Button
    Click Element    id=submit-signup-btn
    
    # Verify Registration Success
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'swal2-popup')]    timeout=10s
    Element Should Contain    xpath=//div[contains(@class, 'swal2-html-container')]    การลงทะเบียนเสร็จสมบูรณ์
    Capture Step Screenshot    user_registration_success
    
    [Teardown]    Close Browser

Invalid Register As User
    Open Browser    ${URL}    ${BROWSER}
    Set Selenium Speed    ${DELAY}
    Maximize Browser Window
    Capture Step Screenshot    user_login_start
    
    # Select User Role
    Wait Until Element Is Visible    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Click Element    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Capture Step Screenshot    user_role_selected
    
    # Select Register
    Click Element  id=signup-btn

    # Input Register Credentials
    Wait Until Element Is Visible    id=signup-form
    Input Text    id=name-input    Athitiya Chaisiriwatthanachai
    Input Text    id=company-input    Uknowme Asset
    Input Text    id=citizen-id-input    1234567899999
    Input Text    id=email-input    athitiya.chaisiriwatthanachai@uknowme.com
    Input Text    id=phone-input    0966566414
    Capture Step Screenshot    user_credentials_entered
    
    # Click Register Button
    Click Element    id=submit-signup-btn
    
    # Verify Registration Failure
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'swal2-popup')]    timeout=10s
    Element Should Contain    xpath=//div[contains(@class, 'swal2-html-container')]    อีเมลนี้เคยลงทะเบียนไว้แล้ว กรุณาใช้อีเมลอื่น
    Capture Step Screenshot    user_registration_failed
    
    [Teardown]    Close Browser

User Enrolled Courses
    Open Browser    ${URL}    ${BROWSER}
    Set Selenium Speed    ${DELAY}
    Maximize Browser Window
    Capture Step Screenshot    user_login_start
    
    # Select User Role
    Wait Until Element Is Visible    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Click Element    xpath=//button[contains(@class, 'role-button') and .//span[text()='ผู้ค้าตราสารหนี้']]
    Capture Step Screenshot    user_role_selected
    
    # Input Login Credentials
    Wait Until Element Is Visible    id=email-input
    Input Text    id=email-input    phattarapong.phe@spumail.net
    Input Password    id=password-input    1329900959999
    Capture Step Screenshot    user_credentials_entered 

    # Click Login Button
    Click Element    id=login-submit-btn

    # Wait for navigation and verify homepage
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'swal2-popup')]    timeout=10s
    Element Should Contain    xpath=//h2[contains(@class, 'swal2-title')]    เข้าสู่ระบบสำเร็จ!
    Click Element   xpath=/html/body/div[2]/div/div[6]/button[1]
    # Wait for page to load
    Sleep    5s
    Wait Until Page Contains Element    xpath=//div[contains(@class, 'course-card')]    timeout=15s
    Capture Step Screenshot    user_homepage
    
    # Click Courses for Enrolled
    Click Element    xpath=//div[contains(@class, 'course-card')]
    Wait Until Page Contains Element    id=about-course-content    timeout=10s
    Capture Step Screenshot    course_details
    
    # Click Enrolled
    Click Element    id=register-course-btn
    Wait Until Element Is Visible    xpath=//div[contains(@class, 'swal2-popup')]    timeout=10s
    Element Should Contain    xpath=//div[contains(@class, 'swal2-html-container')]    ลงทะเบียนสำเร็จ!
    Capture Step Screenshot    user_enrolled_course_success
    
    [Teardown]    Close Browser