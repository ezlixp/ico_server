export class UserErrors {
    static NOT_FOUND = "User with the provided uuid was not found.";
    static FULL_BLOCKED_LIST = "The blocked user list is currently full.";
    static ALREADY_IN_BLOCKED_LIST = "The provided user is already present on the blocked list.";
    static NOT_IN_BLOCKED_LIST = "The provided user is not present on the blocked list.";
}
