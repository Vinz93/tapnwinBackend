const createAndLogin = (res, status, player) => {
    if (player.verified == false)
        player.verified = true;
    if (player.verificationToken)
        player.verificationToken = undefined;

    player.createSessionToken();
    player.save()
        .then(player => {
            res.status(status).json(player);
        })
        .catch(err => res.json(err));
};

export default createAndLogin;
