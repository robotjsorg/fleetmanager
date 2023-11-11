// /* eslint-disable @typescript-eslint/consistent-indexed-object-style */
// /* eslint-disable @typescript-eslint/no-empty-function */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { LoadingManager, Object3D } from "three";
// import URDFLoader, { URDFRobot } from "urdf-loader";

// /**
//  * This exists as a shim between the urdf-loader library and react-three-fiber's useLoader hook.
//  * It basically coerces the URDFLoader class into the same interface as the built-in Loaders in ThreeJS.
//  */
// export default class URDFLoaderShim extends URDFLoader {
//   /** Unused variable whose existence is to make this look like a Loader<URDFRobot> */
//   crossOrigin = "anonymous";
//   /** Unused variable whose existence is to make this look like a Loader<URDFRobot> */
//   withCredentials = false;
//   /** Unused variable whose existence is to make this look like a Loader<URDFRobot> */
//   path = "";
//   /** Unused variable whose existence is to make this look like a Loader<URDFRobot> */
//   resourcePath = "";
//   /** Unused variable whose existence is to make this look like a Loader<URDFRobot> */
//   requestHeader = {};
//   /** Called each time an individual Collada file is loaded. Defaults to an empty function. */
//   onMeshLoad = (obj: Object3D, err?: Error) => {};

//   loadMeshCb = (
//     url: string,
//     manager: LoadingManager,
//     onLoad: (obj: Object3D, err?: Error) => void
//   ) => {
//     this.defaultMeshLoader(url, manager, (loadedObj: Object3D, err?: Error) => {
//       onLoad(loadedObj, err);
//       this.onMeshLoad(loadedObj, err);
//     });
//   };
//   load(
//     url: string,
//     onLoad: (robot: URDFRobot) => void,
//     onProgress?: (event: ProgressEvent<EventTarget>) => void,
//     onError?: (event: ErrorEvent) => void
//   ) {
//     super.load(url, onLoad, onProgress as () => void, onError as () => void);
//   }
//   loadAsync(url: string, onProgress?: (event: ProgressEvent) => void) {
//     return new Promise((resolve, reject) => {
//       this.load(
//         url,
//         (value) => {
//           resolve(value);
//         },
//         onProgress,
//         () => reject()
//       );
//     });
//   }
//   setCrossOrigin(value: string) {
//     this.crossOrigin = value;
//     return this;
//   }
//   setWithCredentials(value: boolean) {
//     this.withCredentials = value;
//     return this;
//   }
//   setPath(value: string) {
//     this.path = value;
//     return this;
//   }
//   setResourcePath(value: string) {
//     this.resourcePath = value;
//     return this;
//   }
//   setRequestHeader(value: { [header: string]: string }) {
//     this.requestHeader = value;
//     return this;
//   }
// }

import URDFLoader from "urdf-loader";
// import { GLTFLoader } from "three-stdlib";

export const Urdf = () => {
  const loader = new URDFLoader();

  // const loadMeshCb = null : (
  //   pathToModel : string,
  //   manager : LoadingManager,
  //   onComplete : ( obj : Object3D, err ?: Error ) => void
  // ) => void;

  // loader.loadMeshCb = function( path, manager ) {
  //   const gltfLoader = new GLTFLoader( manager );
  //   gltfLoader.load(
  //     path,
  //     result => {
  //       console.log(result);
  //     },
  //     undefined,
  //     undefined
  //   );
  // };
  loader.load( "../urdf/T12/urdf/T12.URDF",
    robot => {
      // scene.add( robot );
      console.log( robot );
    },
    undefined,
    undefined
  );

  return (
    <></>
  );
};