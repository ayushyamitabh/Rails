import { approveclass } from './ApproveClassHandler';
import { createclass } from './CreateClassHandler';
import { getclasses } from './GetClassesHandler';
import { getprofile } from './GetProfileHandler';
import { joinclass } from './JoinClassHandler';
import { requestclass } from './RequestClassHandler';
import { signup } from './SignupHandler';

export const handlers = {
    approveclass, createclass, getclasses, getprofile, joinclass, requestclass, signup
};
