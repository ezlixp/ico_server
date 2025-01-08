export class UserErrors {
    static NotFound = "User with the provided uuid was not found.";
    static FullBlockedList = "The blocked user list is currently full.";
    static AlreadyInBlockedList = "The provided user is already present on the blocked list.";
    static NotInBlockedList = "The provided user is not present on the blocked list.";
}