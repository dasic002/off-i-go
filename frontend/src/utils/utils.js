import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {
    console.error(err);
  }
};

export const followHelper = (profile, clickedProfile, following_id) => {
  return profile.id === clickedProfile.id
    ? // profile I clicked on, update its folowers count and set its following id
      {
        ...profile,
        followers_count: profile.followers_count + 1,
        following_id,
      }
    : profile.is_owner
    ? // this is the profile of the logged in user update their following count
      { ...profile, following_count: profile.following_count + 1 }
    : // this is neither the profile the user clicked to follow or the logged in user, return it as is
      profile;
};

export const unfollowHelper = (profile, clickedProfile) => {
  return profile.id === clickedProfile.id
    ? {
        // this profile is the clicked profile, update its followers count and set its following id to null
        ...profile,
        followers_count: profile.followers_count - 1,
        following_id: null,
      }
    : profile.is_owner
    ? // if the profile is the logged in user, update their following count
      { ...profile, following_count: profile.following_count - 1 }
    : // if neither, return current profile data as is
      profile;
};
