function maskedEmail(email) {
    const atindex = email.indexOf('@');
    const username = email.slice(0, atindex);
    const domain = email.slice(atindex);
    const masked = username[0] + "*".repeat(username.length-1);
    return masked + domain;
}
console.log(maskedEmail("olatunjisarahkeji@gmail.com"));
