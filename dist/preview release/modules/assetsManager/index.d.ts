declare module 'babylonjs/assetsManager' {
    enum AssetTaskState {
        INIT = 0,
        RUNNING = 1,
        DONE = 2,
        ERROR = 3,
    }
    abstract class AbstractAssetTask {
        name: string;
        onSuccess: (task: any) => void;
        onError: (task: any, message?: string, exception?: any) => void;
        constructor(name: string);
        isCompleted: boolean;
        taskState: AssetTaskState;
        errorObject: {
            message?: string;
            exception?: any;
        };
        run(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
        runTask(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
        private onErrorCallback(onError, message?, exception?);
        private onDoneCallback(onSuccess, onError);
    }
    interface IAssetsProgressEvent {
        remainingCount: number;
        totalCount: number;
        task: AbstractAssetTask;
    }
    class AssetsProgressEvent implements IAssetsProgressEvent {
        remainingCount: number;
        totalCount: number;
        task: AbstractAssetTask;
        constructor(remainingCount: number, totalCount: number, task: AbstractAssetTask);
    }
    class MeshAssetTask extends AbstractAssetTask {
        name: string;
        meshesNames: any;
        rootUrl: string;
        sceneFilename: string;
        loadedMeshes: Array<AbstractMesh>;
        loadedParticleSystems: Array<ParticleSystem>;
        loadedSkeletons: Array<Skeleton>;
        onSuccess: (task: MeshAssetTask) => void;
        onError: (task: MeshAssetTask, message?: string, exception?: any) => void;
        constructor(name: string, meshesNames: any, rootUrl: string, sceneFilename: string);
        runTask(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
    }
    class TextFileAssetTask extends AbstractAssetTask {
        name: string;
        url: string;
        text: string;
        onSuccess: (task: TextFileAssetTask) => void;
        onError: (task: TextFileAssetTask, message?: string, exception?: any) => void;
        constructor(name: string, url: string);
        runTask(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
    }
    class BinaryFileAssetTask extends AbstractAssetTask {
        name: string;
        url: string;
        data: ArrayBuffer;
        onSuccess: (task: BinaryFileAssetTask) => void;
        onError: (task: BinaryFileAssetTask, message?: string, exception?: any) => void;
        constructor(name: string, url: string);
        runTask(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
    }
    class ImageAssetTask extends AbstractAssetTask {
        name: string;
        url: string;
        image: HTMLImageElement;
        onSuccess: (task: ImageAssetTask) => void;
        onError: (task: ImageAssetTask, message?: string, exception?: any) => void;
        constructor(name: string, url: string);
        runTask(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
    }
    interface ITextureAssetTask<TEX extends BaseTexture> {
        texture: TEX;
    }
    class TextureAssetTask extends AbstractAssetTask implements ITextureAssetTask<Texture> {
        name: string;
        url: string;
        noMipmap: boolean | undefined;
        invertY: boolean | undefined;
        samplingMode: number;
        texture: Texture;
        onSuccess: (task: TextureAssetTask) => void;
        onError: (task: TextureAssetTask, message?: string, exception?: any) => void;
        constructor(name: string, url: string, noMipmap?: boolean | undefined, invertY?: boolean | undefined, samplingMode?: number);
        runTask(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
    }
    class CubeTextureAssetTask extends AbstractAssetTask implements ITextureAssetTask<CubeTexture> {
        name: string;
        url: string;
        extensions: string[] | undefined;
        noMipmap: boolean | undefined;
        files: string[] | undefined;
        texture: CubeTexture;
        onSuccess: (task: CubeTextureAssetTask) => void;
        onError: (task: CubeTextureAssetTask, message?: string, exception?: any) => void;
        constructor(name: string, url: string, extensions?: string[] | undefined, noMipmap?: boolean | undefined, files?: string[] | undefined);
        runTask(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
    }
    class HDRCubeTextureAssetTask extends AbstractAssetTask implements ITextureAssetTask<HDRCubeTexture> {
        name: string;
        url: string;
        size: number | undefined;
        noMipmap: boolean;
        generateHarmonics: boolean;
        useInGammaSpace: boolean;
        usePMREMGenerator: boolean;
        texture: HDRCubeTexture;
        onSuccess: (task: HDRCubeTextureAssetTask) => void;
        onError: (task: HDRCubeTextureAssetTask, message?: string, exception?: any) => void;
        constructor(name: string, url: string, size?: number | undefined, noMipmap?: boolean, generateHarmonics?: boolean, useInGammaSpace?: boolean, usePMREMGenerator?: boolean);
        run(scene: Scene, onSuccess: () => void, onError: (message?: string, exception?: any) => void): void;
    }
    class AssetsManager {
        private _scene;
        private _isLoading;
        protected tasks: AbstractAssetTask[];
        protected waitingTasksCount: number;
        onFinish: (tasks: AbstractAssetTask[]) => void;
        onTaskSuccess: (task: AbstractAssetTask) => void;
        onTaskError: (task: AbstractAssetTask) => void;
        onProgress: (remainingCount: number, totalCount: number, task: AbstractAssetTask) => void;
        onTaskSuccessObservable: Observable<AbstractAssetTask>;
        onTaskErrorObservable: Observable<AbstractAssetTask>;
        onTasksDoneObservable: Observable<AbstractAssetTask[]>;
        onProgressObservable: Observable<IAssetsProgressEvent>;
        useDefaultLoadingScreen: boolean;
        constructor(scene: Scene);
        addMeshTask(taskName: string, meshesNames: any, rootUrl: string, sceneFilename: string): MeshAssetTask;
        addTextFileTask(taskName: string, url: string): TextFileAssetTask;
        addBinaryFileTask(taskName: string, url: string): BinaryFileAssetTask;
        addImageTask(taskName: string, url: string): ImageAssetTask;
        addTextureTask(taskName: string, url: string, noMipmap?: boolean, invertY?: boolean, samplingMode?: number): TextureAssetTask;
        addCubeTextureTask(name: string, url: string, extensions?: string[], noMipmap?: boolean, files?: string[]): CubeTextureAssetTask;
        addHDRCubeTextureTask(name: string, url: string, size?: number, noMipmap?: boolean, generateHarmonics?: boolean, useInGammaSpace?: boolean, usePMREMGenerator?: boolean): HDRCubeTextureAssetTask;
        private _decreaseWaitingTasksCount(task);
        private _runTask(task);
        reset(): AssetsManager;
        load(): AssetsManager;
    }
}

import {EffectFallbacks,EffectCreationOptions,Effect,Nullable,float,double,int,FloatArray,IndicesArray,KeyboardEventTypes,KeyboardInfo,KeyboardInfoPre,PointerEventTypes,PointerInfoBase,PointerInfoPre,PointerInfo,ToGammaSpace,ToLinearSpace,Epsilon,Color3,Color4,Vector2,Vector3,Vector4,ISize,Size,Quaternion,Matrix,Plane,Viewport,Frustum,Space,Axis,BezierCurve,Orientation,Angle,Arc2,Path2,Path3D,Curve3,PositionNormalVertex,PositionNormalTextureVertex,Tmp,Scalar,expandToProperty,serialize,serializeAsTexture,serializeAsColor3,serializeAsFresnelParameters,serializeAsVector2,serializeAsVector3,serializeAsMeshReference,serializeAsColorCurves,serializeAsColor4,serializeAsImageProcessingConfiguration,serializeAsQuaternion,SerializationHelper,EventState,Observer,MultiObserver,Observable,SmartArray,SmartArrayNoDuplicate,IAnimatable,LoadFileError,RetryStrategy,IFileRequest,Tools,PerfCounter,className,AsyncLoop,_AlphaState,_DepthCullingState,_StencilState,InstancingAttributeInfo,RenderTargetCreationOptions,EngineCapabilities,EngineOptions,IDisplayChangedEventArgs,Engine,Node,BoundingSphere,BoundingBox,ICullable,BoundingInfo,TransformNode,AbstractMesh,Light,Camera,RenderingManager,RenderingGroup,IDisposable,IActiveMeshCandidateProvider,RenderingGroupInfo,Scene,Buffer,VertexBuffer,InternalTexture,BaseTexture,Texture,_InstancesBatch,Mesh,BaseSubMesh,SubMesh,MaterialDefines,Material,UniformBuffer,IGetSetVerticesData,VertexData,Geometry,_PrimitiveGeometry,RibbonGeometry,BoxGeometry,SphereGeometry,DiscGeometry,CylinderGeometry,TorusGeometry,GroundGeometry,TiledGroundGeometry,PlaneGeometry,TorusKnotGeometry,PostProcessManager,PerformanceMonitor,RollingAverage,IImageProcessingConfigurationDefines,ImageProcessingConfiguration,ColorGradingTexture,ColorCurves,Behavior,MaterialHelper,PushMaterial,StandardMaterialDefines,StandardMaterial} from 'babylonjs/core';
import {EngineInstrumentation,SceneInstrumentation,_TimeToken} from 'babylonjs/instrumentation';
import {Particle,IParticleSystem,ParticleSystem,BoxParticleEmitter,ConeParticleEmitter,SphereParticleEmitter,SphereDirectedParticleEmitter,IParticleEmitterType} from 'babylonjs/particles';
import {GPUParticleSystem} from 'babylonjs/gpuParticles';
import {NullEngineOptions,NullEngine} from 'babylonjs/nullEngine';
import {FramingBehavior,BouncingBehavior,AutoRotationBehavior} from 'babylonjs/cameraBehaviors';
import {TextureTools} from 'babylonjs/textureTools';
import {Collider,CollisionWorker,ICollisionCoordinator,SerializedMesh,SerializedSubMesh,SerializedGeometry,BabylonMessage,SerializedColliderToWorker,WorkerTaskType,WorkerReply,CollisionReplyPayload,InitPayload,CollidePayload,UpdatePayload,WorkerReplyType,CollisionCoordinatorWorker,CollisionCoordinatorLegacy} from 'babylonjs/collisions';
import {IntersectionInfo,PickingInfo,Ray} from 'babylonjs/picking';
import {SolidParticle,ModelShape,DepthSortedParticle,SolidParticleSystem} from 'babylonjs/solidParticles';
import {AnimationRange,AnimationEvent,PathCursor,Animation,TargetedAnimation,AnimationGroup,RuntimeAnimation,Animatable,IEasingFunction,EasingFunction,CircleEase,BackEase,BounceEase,CubicEase,ElasticEase,ExponentialEase,PowerEase,QuadraticEase,QuarticEase,QuinticEase,SineEase,BezierCurveEase} from 'babylonjs/animations';
import {SpriteManager,Sprite} from 'babylonjs/sprites';
import {Condition,ValueCondition,PredicateCondition,StateCondition,Action,ActionEvent,ActionManager,InterpolateValueAction,SwitchBooleanAction,SetStateAction,SetValueAction,IncrementValueAction,PlayAnimationAction,StopAnimationAction,DoNothingAction,CombineAction,ExecuteCodeAction,SetParentAction,PlaySoundAction,StopSoundAction} from 'babylonjs/actions';
import {GroundMesh,InstancedMesh,LinesMesh} from 'babylonjs/additionalMeshes';
import {ShaderMaterial} from 'babylonjs/shaderMaterial';
import {MeshBuilder} from 'babylonjs/meshBuilder';
import {PBRBaseMaterial,PBRBaseSimpleMaterial,PBRMaterial,PBRMetallicRoughnessMaterial,PBRSpecularGlossinessMaterial} from 'babylonjs/pbrMaterial';
import {CameraInputTypes,ICameraInput,CameraInputsMap,CameraInputsManager,TargetCamera} from 'babylonjs/targetCamera';
import {FreeCameraMouseInput,FreeCameraKeyboardMoveInput,FreeCameraInputsManager,FreeCamera} from 'babylonjs/freeCamera';
import {ArcRotateCameraKeyboardMoveInput,ArcRotateCameraMouseWheelInput,ArcRotateCameraPointersInput,ArcRotateCameraInputsManager,ArcRotateCamera} from 'babylonjs/arcRotateCamera';
import {HemisphericLight} from 'babylonjs/hemisphericLight';
import {IShadowLight,ShadowLight,PointLight} from 'babylonjs/pointLight';
import {DirectionalLight} from 'babylonjs/directionalLight';
import {SpotLight} from 'babylonjs/spotLight';
import {AudioEngine,Sound,SoundTrack,Analyser} from 'babylonjs/audio';
import {CubeTexture,RenderTargetTexture,IMultiRenderTargetOptions,MultiRenderTarget,MirrorTexture,RefractionTexture,DynamicTexture,VideoTexture,RawTexture} from 'babylonjs/additionalTextures';
import {IShadowGenerator,ShadowGenerator} from 'babylonjs/shadows';
import {ILoadingScreen,DefaultLoadingScreen,SceneLoaderProgressEvent,ISceneLoaderPluginExtensions,ISceneLoaderPluginFactory,ISceneLoaderPlugin,ISceneLoaderPluginAsync,SceneLoader,FilesInput} from 'babylonjs/loader';
import {Tags,AndOrNotEvaluator} from 'babylonjs/userData';
import {StringDictionary} from 'babylonjs/stringDictionary';
import {Database} from 'babylonjs/offline';
import {MultiMaterial} from 'babylonjs/multiMaterial';
import {FreeCameraTouchInput,TouchCamera} from 'babylonjs/touchCamera';
import {FresnelParameters} from 'babylonjs/fresnel';
import {ProceduralTexture,CustomProceduralTexture} from 'babylonjs/procedural';
import {FreeCameraGamepadInput,ArcRotateCameraGamepadInput,GamepadManager,StickValues,GamepadButtonChanges,Gamepad,GenericPad,Xbox360Button,Xbox360Dpad,Xbox360Pad,PoseEnabledControllerType,MutableGamepadButton,ExtendedGamepadButton,PoseEnabledControllerHelper,PoseEnabledController,WebVRController,OculusTouchController,ViveController,GenericController,WindowsMotionController} from 'babylonjs/gamepad';
import {FollowCamera,ArcFollowCamera,UniversalCamera,GamepadCamera} from 'babylonjs/additionalCameras';
import {GeometryBufferRenderer} from 'babylonjs/geometryBufferRenderer';
import {DepthRenderer} from 'babylonjs/depthRenderer';
import {PostProcessOptions,PostProcess,PassPostProcess} from 'babylonjs/postProcesses';
import {FxaaPostProcess} from 'babylonjs/additionalPostProcess_fxaa';
import {HighlightsPostProcess} from 'babylonjs/additionalPostProcess_highlights';
import {BlurPostProcess} from 'babylonjs/additionalPostProcess_blur';
import {RefractionPostProcess,BlackAndWhitePostProcess,ConvolutionPostProcess,FilterPostProcess,VolumetricLightScatteringPostProcess,ColorCorrectionPostProcess,TonemappingOperator,TonemapPostProcess,DisplayPassPostProcess,ImageProcessingPostProcess} from 'babylonjs/additionalPostProcesses';
import {PostProcessRenderPipelineManager,PostProcessRenderPass,PostProcessRenderEffect,PostProcessRenderPipeline} from 'babylonjs/renderingPipeline';
import {SSAORenderingPipeline,SSAO2RenderingPipeline,LensRenderingPipeline,StandardRenderingPipeline} from 'babylonjs/additionalRenderingPipeline';
import {Bone,BoneIKController,BoneLookController,Skeleton} from 'babylonjs/bones';
import {DefaultRenderingPipeline} from 'babylonjs/defaultRenderingPipeline';
import {SphericalPolynomial,SphericalHarmonics,CubeMapToSphericalPolynomialTools,CubeMapInfo,PanoramaToCubeMapTools,HDRInfo,HDRTools,HDRCubeTexture} from 'babylonjs/hdr';
import {CSG} from 'babylonjs/csg';
import {Polygon,PolygonMeshBuilder} from 'babylonjs/polygonMesh';
import {PhysicsJointData,PhysicsJoint,DistanceJoint,MotorEnabledJoint,HingeJoint,Hinge2Joint,IMotorEnabledJoint,DistanceJointData,SpringJointData,PhysicsImpostorParameters,IPhysicsEnabledObject,PhysicsImpostor,PhysicsImpostorJoint,PhysicsEngine,IPhysicsEnginePlugin,PhysicsHelper,PhysicsRadialExplosionEvent,PhysicsGravitationalFieldEvent,PhysicsUpdraftEvent,PhysicsVortexEvent,PhysicsRadialImpulseFalloff,PhysicsUpdraftMode,PhysicsForceAndContactPoint,PhysicsRadialExplosionEventData,PhysicsGravitationalFieldEventData,PhysicsUpdraftEventData,PhysicsVortexEventData,CannonJSPlugin,OimoJSPlugin} from 'babylonjs/physics';
import {LensFlare,LensFlareSystem} from 'babylonjs/lensFlares';
import {TGATools,DDSInfo,DDSTools,KhronosTextureContainer} from 'babylonjs/textureFormats';
import {RayHelper,DebugLayer,BoundingBoxRenderer} from 'babylonjs/debug';
import {IOctreeContainer,Octree,OctreeBlock} from 'babylonjs/octrees';
import {MorphTarget,MorphTargetManager} from 'babylonjs/morphTargets';
import {VRDistortionCorrectionPostProcess,AnaglyphPostProcess,StereoscopicInterlacePostProcess,FreeCameraDeviceOrientationInput,ArcRotateCameraVRDeviceOrientationInput,VRCameraMetrics,DevicePose,PoseControlled,WebVROptions,WebVRFreeCamera,DeviceOrientationCamera,VRDeviceOrientationFreeCamera,VRDeviceOrientationGamepadCamera,VRDeviceOrientationArcRotateCamera,AnaglyphFreeCamera,AnaglyphArcRotateCamera,AnaglyphGamepadCamera,AnaglyphUniversalCamera,StereoscopicFreeCamera,StereoscopicArcRotateCamera,StereoscopicGamepadCamera,StereoscopicUniversalCamera,VRTeleportationOptions,VRExperienceHelperOptions,VRExperienceHelper} from 'babylonjs/vr';
import {SIMDHelper} from 'babylonjs/simd';
import {JoystickAxis,VirtualJoystick,VirtualJoysticksCamera,FreeCameraVirtualJoystickInput} from 'babylonjs/virtualJoystick';
import {ISimplifier,ISimplificationSettings,SimplificationSettings,ISimplificationTask,SimplificationQueue,SimplificationType,DecimationTriangle,DecimationVertex,QuadraticMatrix,Reference,QuadraticErrorSimplification,MeshLODLevel,SceneOptimization,TextureOptimization,HardwareScalingOptimization,ShadowsOptimization,PostProcessesOptimization,LensFlaresOptimization,ParticlesOptimization,RenderTargetsOptimization,MergeMeshesOptimization,SceneOptimizerOptions,SceneOptimizer} from 'babylonjs/optimizations';
import {OutlineRenderer,EdgesRenderer,IHighlightLayerOptions,HighlightLayer} from 'babylonjs/highlights';
import {SceneSerializer} from 'babylonjs/serialization';
import {ReflectionProbe} from 'babylonjs/probes';
import {BackgroundMaterial} from 'babylonjs/backgroundMaterial';
import {Layer} from 'babylonjs/layer';
import {IEnvironmentHelperOptions,EnvironmentHelper} from 'babylonjs/environmentHelper';
